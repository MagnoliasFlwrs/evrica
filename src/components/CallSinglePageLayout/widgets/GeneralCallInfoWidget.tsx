import React, {useEffect, useRef} from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import {Flex} from "antd";
import CustomTextModal from "../../ui/CustomTextModal/CustomTextModal";
import BlueArrow from "../../icons/BlueArrow";

const GeneralCallInfoWidget = () => {
    const [attentionModal, setAttentionModal] = React.useState(false);
    const [categoryModal, setCategoryModal] = React.useState(false);
    const attentionModalRef = useRef<HTMLDivElement>(null);
    const categoryModalRef = useRef<HTMLDivElement>(null);

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


    return (
        <Flex className={styles.GeneralCallInfoWidget}>
            <Flex className={styles.GeneralCallInfoWidgetHead}>
                <p className={styles.CallWidgetTitle}>Общая информация</p>
            </Flex>

            <Flex className={styles.GeneralCallInfo}>
                <Flex className={styles.GeneralCallInfoColumn}>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Статус решения проблемы</p>
                        <span>Не решен</span>
                        {/*TO DO цвета */}
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Категория звонка</p>
                        <span>Обзвон лидов</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>ID</p>
                        <span>11132211</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Дата и время</p>
                        <span>11 апр 2025 12:53</span>
                    </Flex>
                </Flex>

                <Flex className={styles.GeneralCallInfoColumn}>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Качество проработки звонка</p>
                        <span>Высокое</span>
                        {/*TO DO цвета */}
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Тип</p>
                        <span>Входящий</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Продолжительность</p>
                        <span>00:11:15</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Ожидание</p>
                        <span>1</span>
                    </Flex>
                </Flex>

                <Flex className={styles.GeneralCallInfoColumn}>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Требует внимания</p>
                        <Flex className={styles.IconRow} ref={attentionModalRef}>
                            <span>Да</span>
                            <button
                                onMouseEnter={() => setAttentionModal(true)}
                                onMouseLeave={() => setAttentionModal(false)}
                            >
                                <BlueArrow/>
                            </button>
                            {
                                attentionModal &&
                                <CustomTextModal
                                    text='Стандартный запрос на подбор автомобиля'
                                    top={true}
                                    left={true}
                                />
                            }
                        </Flex>

                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Оператор</p>
                        <span>Иванов Иван</span>
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