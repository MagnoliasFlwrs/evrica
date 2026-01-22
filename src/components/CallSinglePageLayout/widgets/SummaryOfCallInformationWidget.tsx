import React, {useEffect, useRef, useState} from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import {Flex, Spin} from "antd";
import CustomSelect from "../../ui/CustomSelect/CustomSelect";
import CustomTextModal from "../../ui/CustomTextModal/CustomTextModal";
import {useCallsStore} from "../../../stores/callsStore";
import {useAuth} from "../../../store";
import {AiSystemAnswer} from "../../../stores/types/callsStoreTypes";

const SummaryOfCallInformationWidget = () => {
    const [customerCallInfoList, setCustomerCallInfoList] = useState<string>('');
    const [customerSatisfactionModal, setCustomerSatisfactionModal] = useState<boolean>(false);
    const [tasksModal, setTasksModal] = useState<boolean>(false);
    const customerSatisfactionRef = useRef<HTMLDivElement>(null);
    const tasksModalRef = useRef<HTMLDivElement>(null);
    const promptList = useCallsStore((state) => state.promptList);
    const aiJsonList = useCallsStore((state) => state.aiJsonList);
    const loading = useCallsStore((state) => state.loading);
    const [totalScore, setTotalScore] = useState(0);

    const [systemJsonList, setSystemJsonList] = useState<AiSystemAnswer[]>([]);

    useEffect(() => {
        if (aiJsonList && aiJsonList.length > 0) {
            const firstAiJson = aiJsonList[0];
            const filteredSystem = firstAiJson.answers.system.filter((item: AiSystemAnswer) =>
                item.name === 'БАЗОВЫЙ СИСТЕМНЫЙ'
            );
            setSystemJsonList(filteredSystem);
        }
    }, [aiJsonList]);

    const baseSystemData = systemJsonList[0]?.result;


    const summaryOfCallInformationOptions = Array.isArray(promptList)
        ? promptList.map(item => ({
            value: item.id?.toString() || '',
            label: item.question_label || 'Без названия'
        }))
        : [];

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

    useEffect(() => {
        if (summaryOfCallInformationOptions.length > 0) {
            setCustomerCallInfoList(summaryOfCallInformationOptions[0].value);
        }
    }, [promptList]);


    if (loading) {
        return (
            <Flex className={styles.SummaryOfCallInformationWidgetContainer} justify="center" align="center" style={{minHeight: '200px'}}>
                <Spin />
            </Flex>
        );
    }

    return (
        <Flex className={styles.SummaryOfCallInformationWidgetContainer}>
            <Flex className={styles.GeneralCallInfoWidgetHead}>
                <p className={styles.CallWidgetTitle}>Сводная информация по звонку</p>
                {summaryOfCallInformationOptions.length > 0 ? (
                    <CustomSelect
                        placeholder='Запрос'
                        value={customerCallInfoList}
                        searchable={false}
                        multiple={false}
                        defaultValue={summaryOfCallInformationOptions[0].value}
                        options={summaryOfCallInformationOptions}
                        onChange={(value) => {
                            if (Array.isArray(value) && value.length > 0) {
                                setCustomerCallInfoList(value[0]);
                            } else if (typeof value === 'string') {
                                setCustomerCallInfoList(value);
                            }
                        }}
                    />
                ) : (
                    <p>Нет доступных опций</p>
                )}
            </Flex>

            {aiJsonList && aiJsonList.length > 0 ? (
                <Flex className={styles.InformationListContainer}>
                    <Flex className={styles.InformationListContainerRow}>
                        <p className={styles.InformationListContainerRowTitle}>Удовлетворенность клиента</p>
                        <Flex className={styles.InformationListContainerModalWrapper} ref={customerSatisfactionRef}>
                            <span className={styles.InformationListContainerRowDescrtiption}>
                                {baseSystemData?.удовлетворенность_клиента?.окончательная_оценка?.балл || 'Н/Д'}
                            </span>
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
                            {customerSatisfactionModal && baseSystemData?.удовлетворенность_клиента && (
                                <CustomTextModal
                                    top={true}
                                    right={true}
                                    content={
                                        <ul className={styles.customerSatisfactionList}>
                                            <li>
                                                <p>{baseSystemData?.удовлетворенность_клиента.начальная_оценка?.причина || 'Нет данных'}</p>
                                                <span>{baseSystemData?.удовлетворенность_клиента.начальная_оценка?.балл || 'Н/Д'}</span>
                                            </li>
                                            <li>
                                                <p>{baseSystemData?.удовлетворенность_клиента.окончательная_оценка?.причина || 'Нет данных'}</p>
                                                <span>{baseSystemData?.удовлетворенность_клиента.окончательная_оценка?.балл || 'Н/Д'}</span>
                                            </li>
                                        </ul>
                                    }
                                />
                            )}
                        </Flex>
                    </Flex>

                    <ul className={styles.InformationList}>
                        <li className={styles.InformationListContainerRow}>
                            <p>Чем интересовался клиент</p>
                            <span>{baseSystemData?.информация_по_звонку?.чем_интересовался_клиент || 'Нет данных'}</span>
                        </li>
                        <li className={styles.InformationListContainerRow}>
                            <p>Суть звонка</p>
                            <span>{baseSystemData?.информация_по_звонку?.суть_звонка || 'Нет данных'}</span>
                        </li>
                        <li className={styles.InformationListContainerRow}>
                            <p>Итоги коммуникации</p>
                            <span>{baseSystemData?.информация_по_звонку?.объяснение_ответа_даты_следующего_контакта || 'Нет данных'}</span>
                        </li>
                        <li className={styles.InformationListContainerRow}>
                            <p>Удовлетворенность</p>
                            <span>{(baseSystemData?.удовлетворенность_клиента?.окончательная_оценка?.балл || 0)} / 10</span>
                        </li>
                        <li className={styles.InformationListContainerRow}>
                            <p>Подробности удовлетворенности</p>
                            <span>{baseSystemData?.удовлетворенность_клиента?.сравнение_удовлетворенности || 'Нет данных'}</span>
                        </li>
                        <li className={styles.InformationListContainerRow}>
                            <p>Возможные сложности</p>
                            <span>{baseSystemData?.информация_по_звонку?.выявленная_проблема || 'Нет данных'}</span>
                        </li>
                        <li className={styles.InformationListContainerRow}>
                            <p>Рекомендации</p>
                            <span>
                                {baseSystemData?.удовлетворенность_клиента?.рекомендации ?
                                    baseSystemData.удовлетворенность_клиента.рекомендации.map((item, index) =>
                                        <span key={index}>{item}</span>
                                    ) :
                                    'Нет рекомендаций'
                                }
                            </span>
                        </li>
                    </ul>

                    <Flex className={styles.Tasks}>
                        <Flex className={styles.TasksContainer} ref={tasksModalRef}>
                            <p>Задачи</p>
                            <button onMouseEnter={() => setTasksModal(true)}
                                    onMouseLeave={() => setTasksModal(false)}>
                                1
                            </button>
                            {tasksModal && baseSystemData?.информация_по_менеджеру && (
                                <CustomTextModal
                                    top={true}
                                    left={true}
                                    content={
                                        <ul className={styles.TasksContainerList}>
                                            <li>
                                                <p>{baseSystemData?.информация_по_менеджеру.что_должен_сделать_менеджер || 'Нет задач'}</p>
                                            </li>
                                        </ul>
                                    }
                                />
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            ) : (
                <Flex className={styles.InformationListContainer}>
                    <p>Данные отсутствуют</p>
                </Flex>
            )}
        </Flex>
    );
};

export default SummaryOfCallInformationWidget;