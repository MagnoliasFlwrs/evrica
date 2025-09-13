import React from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import {Flex} from "antd";

const GeneralCallInfoWidget = () => {
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
                        <Flex className={styles.IconRow}>
                            <span>Да</span>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                     fill="none">
                                    <path d="M8.66669 3.33333H12.6667V7.33333" stroke="#007AFF" strokeWidth="0.67"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12.6666 3.33333L3.33331 12.6667" stroke="#007AFF" strokeWidth="0.67"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </Flex>

                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Оператор</p>
                        <span>Иванов Иван</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Категория</p>
                        <Flex className={styles.IconRow}>
                            <span>Салон</span>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                     fill="none">
                                    <path
                                        d="M3.99998 9.33334L4.99998 7.4C5.10869 7.1841 5.27406 7.00181 5.47839 6.87264C5.68271 6.74346 5.91831 6.67227 6.15998 6.66667H13.3333M13.3333 6.66667C13.537 6.66631 13.7381 6.71263 13.9211 6.80206C14.1041 6.89149 14.2642 7.02166 14.389 7.18258C14.5139 7.3435 14.6002 7.53089 14.6414 7.73037C14.6826 7.92985 14.6776 8.13612 14.6266 8.33334L13.6 12.3333C13.5257 12.621 13.3574 12.8757 13.1219 13.0569C12.8864 13.238 12.5971 13.3353 12.3 13.3333H2.66665C2.31302 13.3333 1.97389 13.1929 1.72384 12.9428C1.47379 12.6928 1.33331 12.3536 1.33331 12V3.33334C1.33331 2.97971 1.47379 2.64058 1.72384 2.39053C1.97389 2.14048 2.31302 2 2.66665 2H5.26665C5.48964 1.99782 5.70962 2.0516 5.90645 2.15642C6.10328 2.26124 6.27067 2.41375 6.39331 2.6L6.93331 3.4C7.05472 3.58436 7.22 3.73568 7.41431 3.84041C7.60863 3.94513 7.82591 3.99997 8.04665 4H12C12.3536 4 12.6927 4.14048 12.9428 4.39053C13.1928 4.64058 13.3333 4.97971 13.3333 5.33334V6.66667Z"
                                        stroke="#007AFF" strokeWidth="0.666667" strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                </svg>
                            </button>
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