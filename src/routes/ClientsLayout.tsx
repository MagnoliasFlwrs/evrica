import React, { useState } from 'react';
import { LeftOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Spin } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../components/ui/PageContainer/PageContainer';
import PageTitle from '../components/ui/PageTitle/PageTitle';
import styles from '../components/ClientsLayout/ClientsLayout.module.scss';
import ProbabilityArc from '../components/ClientsLayout/ProbabilityArc';
import girl from '../components/MakeAnAppointmentLayout/managerIcons/Girl.png';

type ClientCard = {
  id: number;
  name: string;
  total: number;
  share: string;
  quality: string;
  kpi: string;
};

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
  icon?: string;
  label?: string;
  date: string;
  colorClass?: string;
  isCurrent?: boolean;
};

const mockClients: ClientCard[] = [
  { id: 1, name: 'Ермаковская Юлия', total: 84, share: '25.3%', quality: '0.0%', kpi: '7.6%' },
  { id: 2, name: 'Мардович Наталья', total: 67, share: '20.2%', quality: '0.0%', kpi: '6.1%' },
  { id: 3, name: 'Бастун Наталья', total: 44, share: '13.3%', quality: '4.5%', kpi: '8.5%' },
  { id: 4, name: 'Водчиц Татьяна', total: 39, share: '11.7%', quality: '7.7%', kpi: '11.2%' },
  { id: 5, name: 'Иванова Елена', total: 55, share: '35.4%', quality: '0.3%', kpi: '4.6%' },
];

const clientFields: ClientField[] = [
  { label: 'Номер телефона', value: '375336909279' },
  { label: 'Место жительства', value: 'Борисоглебск' },
  { label: 'Должность', value: 'не определено' },
  { label: 'Место работы', value: 'не определено' },
  { label: 'Наличие детей', value: 'не определено' },
  { label: 'Хобби', value: 'не определено' },
  { label: 'Сфера деятельности', value: 'не определено' },
];

const communicationItems: CommunicationItem[] = [
  {
    icon: '/icons/message-icon.png',
    label: 'Суть Звонка',
    value:
      'Клиент Георгий обратился с вопросом о возможности оформления рабочей визы в Польшу в связи с переездом его компании. Он интересуется списком необходимых документов, стоимостью услуг и очередью на подачу.',
  },
  {
    icon: '/icons/road-icon.png',
    label: 'Какой Следующий Шаг',
    value: 'Ожидание звонка от специалиста по рабочим визам.',
  },
  {
    icon: '/icons/clock-icon.png',
    label: 'Дата Следующего Контакта',
    value: 'не определено',
  },
  {
    icon: '/icons/comment-icon.png',
    label: 'Выявленная Проблема',
    value: 'Отсутствие официального места работы у клиента.',
  },
  {
    icon: '/icons/chat-icon.png',
    label: 'Сотрудник Не Отработал Возражение',
    value: 'нет',
  },
  {
    icon: '/icons/user-icon.png',
    label: 'Что Должен Сделать Менеджер',
    value:
      'Продолжить консультацию клиента по вопросам спонсорства или предоставления справки о доходах.',
  },
];

const satisfactionItems: SatisfactionItem[] = [
  { icon: '/images/weather-good.png', label: 'Хорошо', date: '18.04', colorClass: 'good' },
  { icon: '/images/weather-bad.png', label: 'Плохо', date: '19.04', colorClass: 'bad' },
  { icon: '/images/weather-terrible.png', label: 'Ужасно', date: '20.04', colorClass: 'terrible' },
  { icon: '/images/weather-neutral.png', label: 'Нормально', date: '21.04', colorClass: 'normal' },
  {
    icon: '/images/weather-excellent.png',
    label: 'Превосходно',
    date: '22.04',
    colorClass: 'excellent',
    isCurrent: true,
  },
  { label: '', date: '23.04' },
  { label: '', date: '24.04' },
];

const TOTAL_RECORDS = 155;

const ClientsLayout = () => {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const [phoneDigits, setPhoneDigits] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchDone, setIsSearchDone] = useState(false);
  const [activeMetric, setActiveMetric] = useState<'shares' | 'quality'>('shares');

  const selectedClient = clientId
    ? mockClients.find((client) => String(client.id) === clientId)
    : null;
  const amountValue = activeMetric === 'shares' ? '$30,000' : '$27,400';
  const priceRangeValue = activeMetric === 'shares' ? '590 - 600 рублей' : '560 - 590 рублей';

  const sanitizeDigits = (value: string) => value.replace(/\D/g, '').slice(0, 7);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneDigits(sanitizeDigits(event.target.value));
    setIsSearchDone(false);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text');
    setPhoneDigits((prev) => sanitizeDigits(prev + pastedText));
    setIsSearchDone(false);
  };

  const handleSearch = () => {
    if (phoneDigits.length !== 7 || isSearching) {
      return;
    }

    setIsSearching(true);
    setIsSearchDone(false);

    window.setTimeout(() => {
      setIsSearching(false);
      setIsSearchDone(true);
    }, 1200);
  };

  const handleOpenClient = (id: number) => {
    navigate(`/clients/${id}`);
  };

  if (clientId) {
    return (
      <PageContainer className={styles.page}>
        <button type="button" className={styles.backToClients} onClick={() => navigate('/clients')}>
          <LeftOutlined />
          <span>Клиенты</span>
        </button>

        <PageTitle text="Карточка клиента" />

        {selectedClient ? (
          <>
            <Flex className={styles.gridTop}>
              <Flex className={styles.card}>
                <Flex vertical className={styles.profileCol}>
                  <img src={girl} alt="Клиент" className={styles.avatar} />

                  <Flex vertical className={styles.profileMeta}>
                    <p className={styles.profileName}>
                      {selectedClient.name} <span className={styles.profileGender}>(женщина)</span>
                    </p>
                    <p className={styles.profileSecondary}>от 25 до 40 лет</p>
                    <p className={styles.profileSecondary}>Замужем</p>
                  </Flex>
                </Flex>

                <Flex vertical className={styles.personInfoCol}>
                  {clientFields.map((item) => (
                    <p key={item.label} className={styles.fieldText}>
                      <span className={styles.fieldLabel}>{item.label}:</span> {item.value}
                    </p>
                  ))}

                  <Flex vertical className={styles.dateBlock}>
                    <span>
                      <span className={styles.dateLabel}>Дата создания карточки:</span> 2026-04-10
                    </span>
                    <span>
                      <span className={styles.dateLabel}>Дата последнего обновления:</span>{' '}
                      2026-04-10
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
                      <p className={styles.amount}>{amountValue}</p>
                    </Flex>
                  </Flex>
                  <p className={styles.range}>
                    <span className={styles.fieldLabel}>Диапазон цен:</span>{' '}
                    <span className={styles.rangeValue}>{priceRangeValue}</span>
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
                        <i className={`${styles.legendDot} ${styles.legendMid}`} />
                        Среднее
                      </span>
                      <span className={styles.legendItem}>
                        <i className={`${styles.legendDot} ${styles.legendTotal}`} />
                        Всего
                      </span>
                    </Flex>
                    <ProbabilityArc last={32} avg={63} total={100} label="Средняя" />
                  </Flex>
                </Flex>
              </Flex>

              <Flex className={styles.cardEmpty} />
            </Flex>

            <Flex vertical className={styles.satisfactionCard}>
              <p className={styles.satisfactionTitle}>Удовлетворенность клиента</p>

              <Flex className={styles.satisfactionRow}>
                {satisfactionItems.map((item, index) => (
                  <div className={styles.satisfactionItemWrapper}>
                    <Flex
                      key={`${item.date}-${index}`}
                      vertical
                      className={`${styles.satisfactionItem} ${item.isCurrent ? styles.current : ''}`}
                    >
                      {item.isCurrent && <span className={styles.currentLabel}>Сейчас</span>}

                      {item.icon && (
                        <img
                          src={item.icon}
                          alt={item.label || 'Состояние'}
                          className={styles.satisfactionIcon}
                        />
                      )}

                      {item.label && <p className={styles.satisfactionName}>{item.label}</p>}
                      {item.colorClass && (
                        <div className={`${styles.satisfactionBar} ${styles[item.colorClass]}`} />
                      )}

                      <span className={styles.satisfactionDate}>{item.date}</span>
                    </Flex>
                  </div>
                ))}
              </Flex>
            </Flex>

            <Flex vertical className={styles.cardCommunication}>
              <Flex className={styles.communicationHead}>
                <p className={styles.communicationTitle}>Последняя коммуникация</p>
                <p>
                  <span className={styles.headLabel}>Дата:</span> 2026-04-10 в 11:44
                </p>
                <p>
                  <span className={styles.headLabel}>Сотрудник:</span> Бастун Наталья
                </p>
                <Link to="/call/1">перейти в звонок</Link>
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
          <p className={styles.detailNotFound}>Клиент не найден</p>
        )}
      </PageContainer>
    );
  }

  return (
    <PageContainer className={styles.page}>
      <PageTitle text="Клиенты" />

      <Flex vertical className={styles.pageContent}>
        <Flex vertical className={styles.searchState}>
          <p className={styles.searchHint}>Введите последние 7 цифр номера телефона</p>

          <Flex className={styles.searchRow}>
            <Input
              className={styles.searchInput}
              prefix={<SearchOutlined />}
              placeholder="1234567"
              value={phoneDigits}
              maxLength={7}
              onChange={handleInputChange}
              onPaste={handlePaste}
            />

            <Button
              type="primary"
              className={styles.searchButton}
              onClick={handleSearch}
              disabled={phoneDigits.length !== 7 || isSearching}
            >
              Найти
            </Button>
          </Flex>

          {!isSearching && !isSearchDone && (
            <p className={styles.baseCount}>В базе данных всего {TOTAL_RECORDS} записей</p>
          )}

          {isSearching && (
            <Flex className={styles.loaderWrap}>
              <Spin size="large" />
            </Flex>
          )}
        </Flex>

        {isSearchDone && !isSearching && (
          <Flex className={styles.resultsGrid}>
            {mockClients.map((client) => (
              <Flex
                key={client.id}
                className={styles.clientCard}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenClient(client.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleOpenClient(client.id);
                  }
                }}
              >
                <p className={styles.clientNameBadge}>{client.name}</p>

                <Flex className={styles.clientCardBody}>
                  <img src={girl} alt={client.name} className={styles.clientAvatar} />

                  <Flex vertical className={styles.clientInfo}>
                    <p className={styles.clientMetric}>
                      <span>Всего за период:</span> {client.total}
                    </p>
                    <p className={styles.clientMetric}>
                      <span>Доля звонков:</span> {client.share}
                    </p>
                    <p className={styles.clientMetric}>
                      <span>Качество:</span> {client.quality}
                    </p>
                    <p className={styles.clientMetric}>
                      <span>КРР:</span> {client.kpi}
                    </p>
                  </Flex>
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
