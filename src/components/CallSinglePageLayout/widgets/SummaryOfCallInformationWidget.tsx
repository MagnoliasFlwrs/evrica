import React, {useEffect, useRef, useState} from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import {Flex, Spin} from "antd";
import CustomSelect from "../../ui/CustomSelect/CustomSelect";
import CustomTextModal from "../../ui/CustomTextModal/CustomTextModal";
import {useCallsStore} from "../../../stores/callsStore";
import {useAuth} from "../../../store";
import {AiSystemAnswer} from "../../../stores/types/callsStoreTypes";

const SummaryOfCallInformationWidget = () => {
    const [customerCallInfoList, setCustomerCallInfoList] = useState<string>(''); // изменено на string
    const [customerSatisfactionModal, setCustomerSatisfactionModal] = useState<boolean>(false);
    const [tasksModal, setTasksModal] = useState<boolean>(false);
    const customerSatisfactionRef = useRef<HTMLDivElement>(null);
    const tasksModalRef = useRef<HTMLDivElement>(null);
    const promptList = useCallsStore((state) => state.promptList);
    const aiJsonList = useCallsStore((state) => state.aiJsonList);
    const loading = useCallsStore((state) => state.loading);
    const [totalScore , setTotalScore] = useState(0);

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

    console.log(baseSystemData);

    const summaryOfCallInformationOptios = promptList.map(item => ({
        value: item.id.toString(),
        label: item.question_label
    }));

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
        if(summaryOfCallInformationOptios.length > 0) {
            setCustomerCallInfoList(summaryOfCallInformationOptios[0].value); // теперь это строка
        }
    }, [promptList]);

    return (
        <Flex className={styles.SummaryOfCallInformationWidgetContainer}>
            <Flex className={styles.GeneralCallInfoWidgetHead}>
                <p className={styles.CallWidgetTitle}>Сводная информация по звонку</p>
                <CustomSelect
                    placeholder='Запрос'
                    value={customerCallInfoList}
                    searchable={false}
                    multiple={false}
                    defaultValue={summaryOfCallInformationOptios.length > 0 ? summaryOfCallInformationOptios[0].value : ''}
                    options={summaryOfCallInformationOptios}
                    onChange={(value) => {
                        if (Array.isArray(value) && value.length > 0) {
                            setCustomerCallInfoList(value[0]);
                        } else if (typeof value === 'string') {
                            setCustomerCallInfoList(value);
                        }
                    }}
                />
            </Flex>
            {
                loading && <Spin/>
            }
            {
                aiJsonList.length > 0 ?
                    <Flex className={styles.InformationListContainer}>
                        <Flex className={styles.InformationListContainerRow}>
                            <p className={styles.InformationListContainerRowTitle}>Удовлетворенность клиента</p>
                            <Flex className={styles.InformationListContainerModalWrapper} ref={customerSatisfactionRef}>
                                <span className={styles.InformationListContainerRowDescrtiption}>{baseSystemData?.удовлетворенность_клиента?.окончательная_оценка?.балл}</span>
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
                                                    <p>{baseSystemData?.удовлетворенность_клиента.начальная_оценка.причина}</p>
                                                    <span>{baseSystemData?.удовлетворенность_клиента.начальная_оценка.балл}</span>
                                                </li>
                                                <li>
                                                    <p>{baseSystemData?.удовлетворенность_клиента.окончательная_оценка.причина}</p>
                                                    <span>{baseSystemData?.удовлетворенность_клиента.окончательная_оценка.балл}</span>
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
                                <span>{baseSystemData?.информация_по_звонку.чем_интересовался_клиент}</span>
                            </li>
                            <li className={styles.InformationListContainerRow}>
                                <p>Суть звонка</p>
                                <span>{baseSystemData?.информация_по_звонку.суть_звонка}</span>
                            </li>
                            <li className={styles.InformationListContainerRow}>
                                <p>Итоги коммуникации</p>
                                <span>{baseSystemData?.информация_по_звонку.объяснение_ответа_даты_следующего_контакта}</span>
                            </li>
                            <li className={styles.InformationListContainerRow}>
                                <p>Удовлетворенность</p>
                                <span>{baseSystemData?.удовлетворенность_клиента.окончательная_оценка.балл} / 10</span>
                            </li>
                            <li className={styles.InformationListContainerRow}>
                                <p>Подробности
                                    удовлетворенности</p>
                                <span>{baseSystemData?.удовлетворенность_клиента.сравнение_удовлетворенности}</span>
                            </li>
                            <li className={styles.InformationListContainerRow}>
                                <p>Возможные сложности</p>
                                <span>{baseSystemData?.информация_по_звонку.выявленная_проблема}</span>
                            </li>
                            <li className={styles.InformationListContainerRow}>
                                <p>Рекомендации</p>
                                <span>{baseSystemData?.удовлетворенность_клиента.рекомендации.map((item)=> <span>{item}</span>)}</span>
                            </li>
                        </ul>
                        <Flex className={styles.Tasks}>
                            <Flex className={styles.TasksContainer} ref={tasksModalRef}>
                                <p>Задачи</p>
                                <button onMouseEnter={() => setTasksModal(true)}
                                        onMouseLeave={() => setTasksModal(false)}>
                                    1
                                </button>
                                {
                                    tasksModal &&
                                    <CustomTextModal
                                        top={true}
                                        left={true}
                                        content={
                                            <ul className={styles.TasksContainerList}>
                                                <li>
                                                    <p>{baseSystemData?.информация_по_менеджеру.что_должен_сделать_менеджер}</p>

                                                </li>
                                            </ul>
                                        }
                                    />
                                }
                            </Flex>

                        </Flex>

                    </Flex>
                    :
                    <Flex className={styles.InformationListContainer}>
                        <p>Данные отсутствуют</p>
                    </Flex>
            }

        </Flex>
    );
};

export default SummaryOfCallInformationWidget;