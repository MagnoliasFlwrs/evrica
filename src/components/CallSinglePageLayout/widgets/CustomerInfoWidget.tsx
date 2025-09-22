import React, {useState} from 'react';
import {Flex} from "antd";
import styles from '../CallSinglePageLayout.module.scss'
import ClientInfoModal from "../ClientInfoModal/ClientInfoModal";

const CustomerInfoWidget = () => {
    const [openClientInfomodal , setOpenClientInfoModal] = useState(false);
    return (
        <Flex className={styles.CustomerInfo}>
            <Flex className={styles.GeneralCallInfoWidgetHead}>
                <p className={styles.CallWidgetTitle}>Общая информация</p>
                <a href="#" onClick={()=> setOpenClientInfoModal(true)}>
                    Подробнее
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                             fill="none">
                            <path d="M8.66669 3.33333H12.6667V7.33333" stroke="#007AFF" strokeWidth="0.67"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12.6666 3.33333L3.33331 12.6667" stroke="#007AFF" strokeWidth="0.67"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </a>
            </Flex>
            <Flex className={styles.GeneralCallInfo}>
                <Flex className={styles.GeneralCallInfoColumn}>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Имя клиента</p>
                        <span>Иван</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Телефон клиента</p>
                        <span>+375 20 101 01 45</span>
                    </Flex>
                </Flex>

                <Flex className={styles.GeneralCallInfoColumn}>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Пол</p>
                        <span>M</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Место жительства</p>
                        <span>Самара</span>
                    </Flex>
                </Flex>
                <Flex className={styles.GeneralCallInfoColumn}>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Семейное положение</p>
                        <span>Женат/Замужем</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Наличие детей</p>
                        <span>-</span>
                    </Flex>
                </Flex>
            </Flex>

            {
                openClientInfomodal &&
                <ClientInfoModal setOpenClientInfoModal={setOpenClientInfoModal}/>
            }
        </Flex>
    );
};

export default CustomerInfoWidget;