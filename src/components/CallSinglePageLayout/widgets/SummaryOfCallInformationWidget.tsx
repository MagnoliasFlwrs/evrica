import React, {useEffect, useRef, useState} from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import {Flex} from "antd";
import CustomSelect from "../../ui/CustomSelect/CustomSelect";
import CustomTextModal from "../../ui/CustomTextModal/CustomTextModal";

const SummaryOfCallInformationWidget = () => {
    const [customerCallInfoList, setCustomerCallInfoList] = useState<string[]>([]);
    const [customerSatisfactionModal, setCustomerSatisfactionModal] = useState<boolean>(false);
    const [tasksModal, setTasksModal] = useState<boolean>(false);
    const customerSatisfactionRef = useRef<HTMLDivElement>(null);
    const tasksModalRef = useRef<HTMLDivElement>(null);

    const handleToggleSatisfactionModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCustomerSatisfactionModal(!customerSatisfactionModal);
        setTasksModal(false);
    }
    const handleToggleTasksModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTasksModal(!tasksModal);
        setCustomerSatisfactionModal(false);
    }
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (customerSatisfactionRef.current && !customerSatisfactionRef.current.contains(e.target as Node)) {
                setCustomerSatisfactionModal(false);
            }
            if (tasksModalRef.current && !tasksModalRef.current.contains(e.target as Node)) {
                setTasksModal(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const summaryOfCallInformationOptios = [
        { value: 'ai', label: 'AI-список' },
        { value: 'customer', label: 'Список клиента' },
        { value: 'new', label: 'Новый список клиента' },
        { value: 'newnew', label: 'Новейший список' },
    ];
    return (
        <Flex className={styles.SummaryOfCallInformationWidgetContainer}>
            <Flex className={styles.GeneralCallInfoWidgetHead}>
                <p className={styles.CallWidgetTitle}>Сводная информация по звонку</p>
                <CustomSelect
                    placeholder='Информация по клиенту'
                    multiple={true}
                    value={customerCallInfoList}
                    options={summaryOfCallInformationOptios}
                    onChange={(value) => {
                        if (Array.isArray(value)) {
                            setCustomerCallInfoList(value);
                        }
                    }}
                />
            </Flex>
            <Flex className={styles.InformationListContainer}>
                <Flex className={styles.InformationListContainerRow}>
                    <p className={styles.InformationListContainerRowTitle}>Удовлетворенность клиента</p>
                    <Flex className={styles.InformationListContainerModalWrapper} ref={customerSatisfactionRef}>
                        <span className={styles.InformationListContainerRowDescrtiption}>9</span>
                        <button onMouseEnter={() => setCustomerSatisfactionModal(true)}
                                onMouseLeave={() => setCustomerSatisfactionModal(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                 fill="none">
                                <path d="M5.33276 7.20002L7.99943 4.53336L10.6661 7.20002" stroke="#00C310"
                                      strokeWidth="0.67" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 4.53336V12.8" stroke="#00C310" strokeWidth="0.67" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </button>
                        {
                            customerSatisfactionModal &&
                            <CustomTextModal
                                top={true}
                                right={true}
                                content={
                                    <ul className={styles.customerSatisfactionList}>
                                        <li>
                                            <p>Клиент обратился с конкретным запросом</p>
                                            <span>5</span>
                                        </li>
                                        <li>
                                            <p>Менеджер предоставил клиенту подробную информацию</p>
                                            <span>9</span>
                                        </li>
                                    </ul>
                                }
                            />
                        }

                    </Flex>
                </Flex>

                <ul className={styles.InformationList}>
                    <li className={styles.InformationListContainerRow}>
                        <p>Чем интересовался клиент</p>
                        <span>Маленькая кухня для дачи, интересуется дизайном</span>
                    </li>
                    <li className={styles.InformationListContainerRow}>
                        <p>Итоги коммуникации</p>
                        <span>Клиент пообещала перезвонить и записаться на консультацию</span>
                    </li>
                    <li className={styles.InformationListContainerRow}>
                        <p>Удовлетворенность</p>
                        <span>7/10</span>
                    </li>
                    <li className={styles.InformationListContainerRow}>
                        <p>Подробности
                            удовлетворенности</p>
                        <span>Клиент в целом доволен, заинтересована в предложении. Оценка могла быть выше, если бы предложили онлайн консултацию</span>
                    </li>
                    <li className={styles.InformationListContainerRow}>
                        <p>Возможные сложности</p>
                        <span>Неизвестные точные размеры кухни на даче</span>
                    </li>
                    <li className={styles.InformationListContainerRow}>
                        <p>Рекомендации</p>
                        <span>Предложите клиенту возможность прислать примерные размеры и фото помещения для предварительной онлайн-консультации. Это повысит заинтересованность и лояльность клиента.</span>
                    </li>
                    <li className={styles.InformationListContainerRow}>
                        <p>Рекомендации</p>
                        <span>Предложите клиенту возможность прислать примерные размеры и фото помещения для предварительной онлайн-консультации. </span>
                    </li>
                    <li className={styles.InformationListContainerRow}>
                        <p>Рекомендации</p>
                        <span>Предложите клиенту возможность прислать примерные размеры и фото помещения для предварительной онлайн-консультации. Это повысит заинтересованность и лояльность клиента.</span>
                    </li>
                    <li className={styles.InformationListContainerRow}>
                        <p>Рекомендации</p>
                        <span>Предложите клиенту возможность прислать примерные размеры и фото помещения для предварительной онлайн-консультации. Это повысит заинтересованность и лояльность клиента.</span>
                    </li>
                    <li className={styles.InformationListContainerRow}>
                        <p>Рекомендации</p>
                        <span>Предложите клиенту возможность прислать примерные размеры и фото помещения для предварительной онлайн-консультации. </span>
                    </li>
                    <li className={styles.InformationListContainerRow}>
                        <p>Рекомендации</p>
                        <span>Предложите клиенту возможность прислать примерные размеры и фото помещения для предварительной онлайн-консультации. Это повысит заинтересованность и лояльность клиента.</span>
                    </li>
                </ul>
                <Flex className={styles.Tasks}>
                    <Flex className={styles.TasksContainer} ref={tasksModalRef}>
                        <p>Задачи</p>
                        <button onMouseEnter={() => setTasksModal(true)}
                                onMouseLeave={() => setTasksModal(false)}>
                            4
                        </button>
                        {
                            tasksModal &&
                            <CustomTextModal
                                top={true}
                                left={true}
                                content={
                                    <ul className={styles.TasksContainerList}>
                                        <li>
                                            <p>1. Отправить сообщение в WhatsApp, назначить встречу.</p>

                                        </li>
                                        <li>
                                            <p>2. Перезвонить в понедельник 17 апреля</p>
                                        </li>
                                        <li>
                                            <p>3. Отправить сообщение в WhatsApp, назначить встречу.</p>

                                        </li>
                                        <li>
                                            <p>4. Перезвонить в понедельник 17 апреля</p>
                                        </li>
                                    </ul>
                                }
                            />
                        }
                    </Flex>

                </Flex>

            </Flex>
        </Flex>
    );
};

export default SummaryOfCallInformationWidget;