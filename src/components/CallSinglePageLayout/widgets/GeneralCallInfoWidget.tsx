import React, {JSX, useEffect, useRef, useState} from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import {Flex} from "antd";
import CustomTextModal from "../../ui/CustomTextModal/CustomTextModal";
import BlueArrow from "../../icons/BlueArrow";
import {useCallsStore} from "../../../stores/callsStore";
import {formatDateTime, formatSecondsToTimeWithHours} from "../utils";
import {AiSystemAnswer} from "../../../stores/types/callsStoreTypes";

const GeneralCallInfoWidget = () => {
    const [attentionModal, setAttentionModal] = React.useState(false);
    const [categoryModal, setCategoryModal] = React.useState(false);
    const attentionModalRef = useRef<HTMLDivElement>(null);
    const categoryModalRef = useRef<HTMLDivElement>(null);
    const currentCallInfo = useCallsStore((state)=> state.currentCallInfo);
    const [callType, setCallType] = useState<string | undefined>(undefined);
    const aiJsonList = useCallsStore((state) => state.aiJsonList);

    const [systemJsonList, setSystemJsonList] = useState<AiSystemAnswer[]>([]);

    useEffect(() => {
        if (aiJsonList && aiJsonList.length > 0) {
            // Обрабатываем первый элемент массива (или все, если нужно)
            const firstAiJson = aiJsonList[0];
            const filteredSystem = firstAiJson.answers.system.filter((item: AiSystemAnswer) =>
                item.name === 'БАЗОВЫЙ СИСТЕМНЫЙ'
            );
            setSystemJsonList(filteredSystem);
        }
    }, [aiJsonList]);

    useEffect(() => {
        if(currentCallInfo) {
            setCallType(currentCallInfo.call.call_type)
        }
    }, [currentCallInfo]);

    const handleToggleAttentionModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAttentionModal(!attentionModal);
        setCategoryModal(false);
    }
    const handleToggleCategoryModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCategoryModal(!categoryModal);
        setAttentionModal(false);
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (attentionModalRef.current && !attentionModalRef.current.contains(e.target as Node)) {
                setAttentionModal(false);
            }
            if (categoryModalRef.current && !categoryModalRef.current.contains(e.target as Node)) {
                setCategoryModal(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const baseSystemData = systemJsonList[0].result;
    console.log(baseSystemData)

    return (
        <Flex className={styles.GeneralCallInfoWidget}>
            <Flex className={styles.GeneralCallInfoWidgetHead}>
                <p className={styles.CallWidgetTitle}>Общая информация</p>
            </Flex>

            <Flex className={styles.GeneralCallInfo}>
                <Flex className={styles.GeneralCallInfoColumn}>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Статус решения проблемы</p>
                        <span>
                            {baseSystemData?.информация_по_звонку?.статус_решения_проблемы || 'Не решен'}
                        </span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Категория звонка</p>
                        <span>Обзвон лидов</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>ID</p>
                        <span>{currentCallInfo?.call_id}</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Дата и время</p>
                        <span>{formatDateTime(currentCallInfo?.call?.date_call ?? '')}</span>
                    </Flex>
                </Flex>

                <Flex className={styles.GeneralCallInfoColumn}>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Качество проработки звонка</p>
                        <span>
                            {baseSystemData?.информация_по_звонку?.качество_проработки_звонка || 'Высокое'}
                        </span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Тип</p>
                        <span>{callType === 'in' ?  'Входящий' : 'Исходящий'}</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Продолжительность</p>
                        <span>{currentCallInfo?.audio_file_duration ? formatSecondsToTimeWithHours(currentCallInfo?.audio_file_duration) : '-'}</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Ожидание</p>
                        <span>{currentCallInfo?.wait_time ?? 'не указано'}</span>
                    </Flex>
                </Flex>

                <Flex className={styles.GeneralCallInfoColumn}>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Требует внимания</p>
                        <Flex className={styles.IconRow} ref={attentionModalRef}>
                            <span>
                                {baseSystemData?.информация_по_звонку?.["требует_звонок_незамедлительного_внимания (проблемный звонок)"].да_или_нет === 'да' ? 'Да' : 'Нет'}
                            </span>
                            <button
                                onMouseEnter={() => setAttentionModal(true)}
                                onMouseLeave={() => setAttentionModal(false)}
                            >
                                <BlueArrow/>
                            </button>
                            {
                                attentionModal &&
                                <CustomTextModal
                                    text={baseSystemData?.информация_по_звонку?.["требует_звонок_незамедлительного_внимания (проблемный звонок)"]?.объяснение}
                                    top={true}
                                    left={true}
                                />
                            }
                        </Flex>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Оператор</p>
                        <span>{currentCallInfo?.agent_name ?? 'не указано'}</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Категория</p>
                        <Flex className={styles.IconRow} ref={categoryModalRef}>
                            <span>Салон</span>
                            <button onMouseEnter={() => setCategoryModal(true)}
                                    onMouseLeave={() => setCategoryModal(false)}>
                                <BlueArrow/>
                            </button>
                            {
                                categoryModal &&
                                <CustomTextModal
                                    text='Категория / Подкатегория / Подподкатеогория'
                                    bottom={true}
                                    left={true}
                                />
                            }
                        </Flex>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Номер</p>
                        <span>101</span>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default GeneralCallInfoWidget;