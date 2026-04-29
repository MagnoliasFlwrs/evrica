import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LeftOutlined, SearchOutlined } from '@ant-design/icons';
import { Flex, Input, Spin } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../components/ui/PageContainer/PageContainer';
import PageTitle from '../components/ui/PageTitle/PageTitle';
import styles from '../components/ClientsLayout/ClientsLayout.module.scss';
import ProbabilityArc from '../components/ClientsLayout/ProbabilityArc';
import girl from '../components/MakeAnAppointmentLayout/managerIcons/Girl.png';
import man from '../components/MakeAnAppointmentLayout/managerIcons/Man.png';
import { useAuth } from '../store';
import { useClientsStore } from '../stores/clientsStore';
import { ClientLastCall } from '../stores/types/clientsStoreTypes';
import { formatCallDate, formatTimelineDate, toFirstUpperCase } from '../utils';
import { log } from 'node:console';

type ClientField = {
  label: string;
  value: string;
};

type CommunicationItem = {
  icon: string;
  label: string;
  value: string;
};

type SatisfactionItem = {
  icon: string;
  label: string;
  date: string;
  colorClass: string;
  call: ClientLastCall;
};

const NOT_DEFINED = 'не определено';

const normalize = (value: string) => value.trim().toLowerCase();

const isNotDefined = (value: string) => normalize(value) === NOT_DEFINED;

const toDefinedValues = (values?: string[]) => {
  if (!values || values.length === 0) return [] as string[];

  const seen = new Set<string>();
  const result: string[] = [];

  values.forEach((raw) => {
    const value = raw?.trim();
    if (!value || isNotDefined(value)) return;
    const key = normalize(value);
    if (seen.has(key)) return;
    seen.add(key);
    result.push(value);
  });

  return result;
};

const formatArrayField = (values?: string[]) => {
  const defined = toDefinedValues(values);
  return defined.length ? defined.join(', ') : NOT_DEFINED;
};

const formatClientName = (values?: string[]) => {
  if (!values || values.length === 0) return NOT_DEFINED;

  const valid = values
    .map((item) => item?.trim())
    .filter((item): item is string => !!item && !isNotDefined(item));
  if (!valid.length) return NOT_DEFINED;
  if (valid.length === 1) return valid[0];

  const uniqueValid = toDefinedValues(valid);
  if (uniqueValid.length >= 5 && uniqueValid.length === valid.length) {
    return uniqueValid.join(', ');
  }

  const counts = new Map<string, { count: number; label: string }>();
  valid.forEach((item) => {
    const key = normalize(item);
    const current = counts.get(key);
    if (current) {
      current.count += 1;
    } else {
      counts.set(key, { count: 1, label: item });
    }
  });

  const sorted = Array.from(counts.values()).sort((first, second) => second.count - first.count);
  const primary = sorted[0].label;
  const others = uniqueValid.filter((item) => normalize(item) !== normalize(primary));

  if (!others.length) return primary;
  return `${primary} (${others.join(', ')})`;
};

const resolveGender = (values?: string[]) => {
  if (!values || values.length === 0) return NOT_DEFINED;

  const score = values.reduce((accumulator, raw) => {
    const value = raw?.trim().toLowerCase();
    if (!value || value === NOT_DEFINED) return accumulator;
    if (value.includes('муж')) return accumulator + 1;
    if (value.includes('жен')) return accumulator - 1;
    return accumulator;
  }, 0);

  if (score > 0) return 'мужчина';
  if (score < 0) return 'женщина';
  return NOT_DEFINED;
};

const resolveMostFrequent = (values?: string[]) => {
  if (!values || values.length === 0) return NOT_DEFINED;

  const filtered = values
    .map((item) => item?.trim())
    .filter((item): item is string => !!item && !isNotDefined(item));

  if (!filtered.length) return NOT_DEFINED;

  const counts = new Map<string, { count: number; label: string }>();
  filtered.forEach((item) => {
    const key = normalize(item);
    const current = counts.get(key);
    if (current) {
      current.count += 1;
    } else {
      counts.set(key, { count: 1, label: item });
    }
  });

  const countValues = Array.from(counts.values());
  const max = Math.max(...countValues.map((item) => item.count));
  const leaders = countValues.filter((item) => item.count === max);

  if (leaders.length > 1) return NOT_DEFINED;
  return leaders[0].label;
};

const getRecordsWord = (count: number) => {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'записей';
  if (mod10 === 1) return 'запись';
  if (mod10 >= 2 && mod10 <= 4) return 'записи';
  return 'записей';
};

const mapSatisfactionMeta = (
  satisfactionRaw: string,
): { icon: string; label: string; colorClass: string } => {
  if (satisfactionRaw === 'не определено') {
    return {
      icon: '/images/weather-neutral.png',
      label: 'Не определено',
      colorClass: 'normal',
    };
  }

  const score = Number(satisfactionRaw);
  if (!Number.isFinite(score)) {
    return {
      icon: '/images/weather-neutral.png',
      label: 'Не определено',
      colorClass: 'normal',
    };
  }

  if (score >= 9) {
    return { icon: '/images/weather-excellent.png', label: 'Превосходно', colorClass: 'excellent' };
  }
  if (score >= 7) {
    return { icon: '/images/weather-good.png', label: 'Хорошо', colorClass: 'good' };
  }
  if (score >= 5) {
    return { icon: '/images/weather-neutral.png', label: 'Нормально', colorClass: 'normal' };
  }
  if (score >= 3) {
    return { icon: '/images/weather-bad.png', label: 'Плохо', colorClass: 'bad' };
  }

  return { icon: '/images/weather-terrible.png', label: 'Ужасно', colorClass: 'terrible' };
};

const mapProbabilityToScore = (value: string) => {
  const normalized = value.toLowerCase();
  if (normalized.includes('высок')) return 82;
  if (normalized.includes('сред')) return 58;
  if (normalized.includes('низ')) return 32;
  return 50;
};

const ClientsLayout = () => {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const user = useAuth((state) => state.user);
  const orgId = user?.organization_id;

  const clientsPhonesTotal = useClientsStore((state) => state.clientsPhonesTotal);
  const clientsFoundTotal = useClientsStore((state) => state.clientsFoundTotal);
  const clientNumbers = useClientsStore((state) => state.clientNumbers);
  const clientsSearchLoading = useClientsStore((state) => state.clientsSearchLoading);
  const clientCardLoading = useClientsStore((state) => state.clientCardLoading);
  const clientCardBase = useClientsStore((state) => state.clientCardBase);
  const clientLastCalls = useClientsStore((state) => state.clientLastCalls);
  const getClientPhonesList = useClientsStore((state) => state.getClientPhonesList);
  const findClient = useClientsStore((state) => state.findClient);
  const resetClientSearchResults = useClientsStore((state) => state.resetClientSearchResults);
  const loadClientCard = useClientsStore((state) => state.loadClientCard);
  const clearClientCard = useClientsStore((state) => state.clearClientCard);

  const [searchValue, setSearchValue] = useState('');
  const [activeMetric] = useState<'shares' | 'quality'>('shares');
  const [activeSatisfactionIndex, setActiveSatisfactionIndex] = useState(0);
  const satisfactionRowRef = useRef<HTMLDivElement | null>(null);
  const satisfactionItemRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeFrame, setActiveFrame] = useState({ left: 0, width: 0, height: 0 });

  const decodedClientNumber = clientId ? decodeURIComponent(clientId) : '';
  const isDetailMode = Boolean(clientId);

  const sortedCalls = useMemo(
    () =>
      [...clientLastCalls].sort((first, second) => {
        const firstTime = new Date(first.date_call).getTime();
        const secondTime = new Date(second.date_call).getTime();
        return firstTime - secondTime;
      }),
    [clientLastCalls],
  );

  const satisfactionItems: SatisfactionItem[] = useMemo(
    () =>
      sortedCalls.map((call) => {
        const mapped = mapSatisfactionMeta(call.customer_satisfaction);
        return {
          icon: mapped.icon,
          label: mapped.label,
          colorClass: mapped.colorClass,
          date: formatTimelineDate(call.date_call),
          call,
        };
      }),
    [sortedCalls],
  );

  const activeCall = satisfactionItems[activeSatisfactionIndex]?.call ?? null;

  const amountValue =
    activeMetric === 'shares'
      ? clientCardBase?.last_trade_amount || 'не определено'
      : clientCardBase?.last_trade_amount || 'не определено';
  const priceRangeValue =
    activeMetric === 'shares'
      ? clientCardBase?.price_range || 'не определено'
      : clientCardBase?.price_range || 'не определено';

  const resolvedGender = useMemo(
    () => resolveGender(clientCardBase?.gender),
    [clientCardBase?.gender],
  );
  const resolvedName = useMemo(
    () => formatClientName(clientCardBase?.names),
    [clientCardBase?.names],
  );
  const resolvedMaritalStatus = useMemo(
    () => resolveMostFrequent(clientCardBase?.marital_status),
    [clientCardBase?.marital_status],
  );

  const avatarSource = resolvedGender === 'мужчина' ? man : girl;

  const baseFields: ClientField[] = useMemo(
    () => [
      { label: 'Номер телефона', value: decodedClientNumber || 'не определено' },
      { label: 'Место жительства', value: formatArrayField(clientCardBase?.place_of_residence) },
      { label: 'Должность', value: formatArrayField(clientCardBase?.job_title) },
      { label: 'Место работы', value: formatArrayField(clientCardBase?.place_of_work) },
      { label: 'Наличие детей', value: formatArrayField(clientCardBase?.presence_of_children) },
      { label: 'Хобби', value: formatArrayField(clientCardBase?.hobby) },
      { label: 'Сфера деятельности', value: formatArrayField(clientCardBase?.field_of_activity) },
    ],
    [clientCardBase, decodedClientNumber],
  );

  const communicationItems: CommunicationItem[] = useMemo(
    () => [
      {
        icon: '/icons/message-icon.png',
        label: 'Суть Звонка',
        value: activeCall?.essence_of_the_call || 'не определено',
      },
      {
        icon: '/icons/road-icon.png',
        label: 'Какой Следующий Шаг',
        value: activeCall?.next_step || 'не определено',
      },
      {
        icon: '/icons/clock-icon.png',
        label: 'Дата Следующего Контакта',
        value: activeCall?.next_contact_date || 'не определено',
      },
      {
        icon: '/icons/comment-icon.png',
        label: 'Выявленная Проблема',
        value: activeCall?.identified_problem || 'не определено',
      },
      {
        icon: '/icons/chat-icon.png',
        label: 'Сотрудник Не Отработал Возражение',
        value: activeCall?.employee_did_not_process_the_objection || 'не определено',
      },
      {
        icon: '/icons/user-icon.png',
        label: 'Что Должен Сделать Менеджер',
        value: activeCall?.what_should__manager_do || 'не определено',
      },
    ],
    [activeCall],
  );

  const lastProbability = mapProbabilityToScore(
    clientCardBase?.probability_of_making_deal || 'не определено',
  );

  const foundCountToShow = searchValue ? clientsFoundTotal : clientsPhonesTotal;
  const recordsWord = getRecordsWord(foundCountToShow);

  const sanitizeDigits = (value: string) => value.replace(/\D/g, '').slice(0, 15);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(sanitizeDigits(event.target.value));
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text');
    setSearchValue((prev) => sanitizeDigits(prev + pastedText));
  };

  const handleOpenClient = (clientNumber: string) => {
    navigate(`/clients/${encodeURIComponent(clientNumber)}`);
  };

  useEffect(() => {
    if (!orgId || isDetailMode) {
      return;
    }

    getClientPhonesList(orgId);
  }, [getClientPhonesList, isDetailMode, orgId]);

  useEffect(() => {
    if (!orgId || isDetailMode) {
      return;
    }

    const debouncedCall = window.setTimeout(() => {
      if (!searchValue) {
        resetClientSearchResults();
        return;
      }

      findClient(orgId, searchValue, 1, 20);
    }, 450);

    return () => {
      window.clearTimeout(debouncedCall);
    };
  }, [findClient, isDetailMode, orgId, resetClientSearchResults, searchValue]);

  useEffect(() => {
    if (!orgId || !decodedClientNumber) {
      return;
    }

    loadClientCard(orgId, decodedClientNumber);

    return () => {
      clearClientCard();
    };
  }, [clearClientCard, decodedClientNumber, loadClientCard, orgId]);

  useEffect(() => {
    if (!satisfactionItems.length) {
      setActiveSatisfactionIndex(0);
      return;
    }

    setActiveSatisfactionIndex(satisfactionItems.length - 1);
  }, [satisfactionItems]);

  const updateActiveFrame = useCallback(() => {
    const rowElement = satisfactionRowRef.current;
    const activeElement = satisfactionItemRefs.current[activeSatisfactionIndex];

    if (!rowElement || !activeElement) {
      return;
    }

    const rowRect = rowElement.getBoundingClientRect();
    const itemRect = activeElement.getBoundingClientRect();

    setActiveFrame({
      left: itemRect.left - rowRect.left,
      width: itemRect.width,
      height: itemRect.height,
    });
  }, [activeSatisfactionIndex]);

  useEffect(() => {
    updateActiveFrame();
  }, [updateActiveFrame]);

  useEffect(() => {
    window.addEventListener('resize', updateActiveFrame);

    return () => {
      window.removeEventListener('resize', updateActiveFrame);
    };
  }, [updateActiveFrame]);

  if (isDetailMode) {
    return (
      <PageContainer className={styles.page}>
        <button type="button" className={styles.backToClients} onClick={() => navigate('/clients')}>
          <LeftOutlined />
          <span>Клиенты</span>
        </button>

        <PageTitle text="Карточка клиента" />

        {!clientCardLoading ? (
          <>
            <Flex className={styles.gridTop}>
              <Flex className={styles.card}>
                <Flex vertical className={styles.profileCol}>
                  <img src={avatarSource} alt="Клиент" className={styles.avatar} />

                  <Flex vertical className={styles.profileMeta}>
                    <p className={styles.profileName}>
                      {resolvedName}{' '}
                      <span className={styles.profileGender}>({resolvedGender})</span>
                    </p>
                    <p className={styles.profileSecondary}>
                      {formatArrayField(clientCardBase?.age)}
                    </p>
                    <p className={styles.profileSecondary}>{resolvedMaritalStatus}</p>
                  </Flex>
                </Flex>

                <Flex vertical className={styles.personInfoCol}>
                  {baseFields.map((item) => (
                    <p key={item.label} className={styles.fieldText}>
                      <span className={styles.fieldLabel}>{item.label}:</span> {item.value}
                    </p>
                  ))}

                  <Flex vertical className={styles.dateBlock}>
                    <span>
                      <span className={styles.dateLabel}>Дата первой коммуникации:</span>{' '}
                      {formatCallDate(clientCardBase?.date_first_communication)}
                    </span>
                    <span>
                      <span className={styles.dateLabel}>Дата последней коммуникации:</span>{' '}
                      {formatCallDate(clientCardBase?.date_last_communication)}
                    </span>
                  </Flex>
                </Flex>
              </Flex>

              <Flex vertical className={styles.rightCardsCol}>
                {/* <Flex className={styles.metricTop}>
                  <p className={styles.metricSource}>Информация из:</p>
                  <Flex className={styles.metricSwitcher}>
                    <button
                      type="button"
                      className={`${styles.metricButton} ${activeMetric === 'shares' ? styles.active : ''}`}
                      onClick={() => setActiveMetric('shares')}
                    >
                      Последнего звонка
                    </button>
                    <button
                      type="button"
                      className={`${styles.metricButton} ${activeMetric === 'quality' ? styles.active : ''}`}
                      onClick={() => setActiveMetric('quality')}
                    >
                      Карточки клиента
                    </button>
                  </Flex>
                </Flex> */}

                <Flex vertical className={styles.cardSmall}>
                  <Flex className={styles.amountHead}>
                    <img src="/icons/dollar-icon.png" alt="" className={styles.dollarIcon} />
                    <Flex vertical className={styles.amountInfo}>
                      <p className={styles.cardHeading}>Сумма последней сделки</p>
                      <p className={styles.amount}>{amountValue || 'не определено'}</p>
                    </Flex>
                  </Flex>
                  <p className={styles.range}>
                    <span className={styles.fieldLabel}>Диапазон цен:</span>{' '}
                    <span className={styles.rangeValue}>{priceRangeValue || 'не определено'}</span>
                  </p>
                </Flex>

                <Flex vertical className={styles.cardSmall}>
                  <p className={styles.cardHeading}>Вероятность Заключения Сделки</p>
                  <Flex vertical className={styles.probabilityWrap}>
                    <Flex className={styles.probabilityLegend}>
                      <span className={styles.legendItem}>
                        <i className={`${styles.legendDot} ${styles.legendLast}`} />
                        Последнее
                      </span>
                      <span className={styles.legendItem}>
                        <i className={`${styles.legendDot} ${styles.legendTotal}`} />
                        Всего
                      </span>
                    </Flex>
                    <ProbabilityArc
                      last={lastProbability}
                      avg={0}
                      total={100}
                      label={toFirstUpperCase(clientCardBase?.probability_of_making_deal)}
                    />
                  </Flex>
                </Flex>
              </Flex>

              <Flex className={styles.cardEmpty} />
            </Flex>

            <Flex vertical className={styles.satisfactionCard}>
              <p className={styles.satisfactionTitle}>Удовлетворенность клиента</p>

              <div className={styles.satisfactionRow} ref={satisfactionRowRef}>
                {satisfactionItems.length > 0 && (
                  <div
                    className={styles.satisfactionActiveFrame}
                    style={{
                      width: `${activeFrame.width}px`,
                      height: `${activeFrame.height}px`,
                      transform: `translateX(${activeFrame.left}px)`,
                    }}
                  >
                    {activeSatisfactionIndex === satisfactionItems.length - 1 && (
                      <span className={styles.currentLabel}>Сейчас</span>
                    )}
                  </div>
                )}

                {satisfactionItems.length > 0 ? (
                  satisfactionItems.map((item, index) => (
                    <Flex
                      key={`${item.call.id}-${item.date}-${index}`}
                      vertical
                      role="button"
                      tabIndex={0}
                      className={`${styles.satisfactionItem} ${activeSatisfactionIndex === index ? styles.current : ''}`}
                      ref={(element) => {
                        satisfactionItemRefs.current[index] = element;
                      }}
                      onClick={() => setActiveSatisfactionIndex(index)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setActiveSatisfactionIndex(index);
                        }
                      }}
                    >
                      <img src={item.icon} alt={item.label} className={styles.satisfactionIcon} />

                      <p className={styles.satisfactionName}>{item.label}</p>
                      <div className={`${styles.satisfactionBar} ${styles[item.colorClass]}`} />

                      <span className={styles.satisfactionDate}>{item.date}</span>
                    </Flex>
                  ))
                ) : (
                  <p className={styles.detailNotFound}>Нет данных по последним звонкам</p>
                )}
              </div>
            </Flex>

            <Flex vertical className={styles.cardCommunication}>
              <Flex className={styles.communicationHead}>
                <p className={styles.communicationTitle}>Последняя коммуникация</p>
                <p>
                  <span className={styles.headLabel}>Дата:</span>{' '}
                  {formatCallDate(activeCall?.date_call)}
                </p>
                <p>
                  <span className={styles.headLabel}>Сотрудник:</span>{' '}
                  {activeCall?.manager || 'не определено'}
                </p>
                <Link to={`/call/${activeCall?.id || ''}`}>перейти в звонок</Link>
              </Flex>

              <Flex vertical className={styles.communicationBody}>
                {communicationItems.map((item) => (
                  <Flex key={item.label} className={styles.communicationRow}>
                    <img src={item.icon} alt="" className={styles.rowIcon} />
                    <p className={styles.fieldText}>
                      <span className={styles.fieldLabel}>{item.label}:</span> {item.value}
                    </p>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </>
        ) : (
          <Flex className={styles.loaderWrap}>
            <Spin size="large" />
          </Flex>
        )}
      </PageContainer>
    );
  }

  return (
    <PageContainer className={styles.page}>
      <PageTitle text="Клиенты" />

      <Flex vertical className={styles.pageContent}>
        <Flex vertical className={styles.searchState}>
          <p className={styles.searchHint}>Введите номер телефона</p>

          <Flex className={styles.searchRow}>
            <Input
              className={styles.searchInput}
              prefix={<SearchOutlined />}
              placeholder="291234567"
              value={searchValue}
              maxLength={15}
              onChange={handleInputChange}
              onPaste={handlePaste}
            />
          </Flex>

          <p className={styles.baseCount}>
            Найдено в базе {foundCountToShow} {recordsWord}
          </p>

          {clientsSearchLoading && (
            <Flex className={styles.loaderWrap}>
              <Spin />
            </Flex>
          )}
        </Flex>

        {!clientsSearchLoading &&
          searchValue &&
          clientsFoundTotal < 10 &&
          clientNumbers.length > 0 && (
            <Flex className={styles.resultsGrid}>
              {clientNumbers.map((clientNumber) => (
                <Flex
                  key={clientNumber}
                  className={styles.clientCard}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenClient(clientNumber)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleOpenClient(clientNumber);
                    }
                  }}
                >
                  {/* <p className={styles.clientNameBadge}>{clientNumber}</p> */}

                  <Flex className={styles.clientCardBody}>
                    {/* <img src={girl} alt={clientNumber} className={styles.clientAvatar} /> */}
                    <p className={styles.clientMetric}>{clientNumber}</p>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          )}
      </Flex>
    </PageContainer>
  );
};

export default ClientsLayout;
