import React, {useMemo, useState} from 'react';
import {Flex} from "antd";
import styles from '../CallSinglePageLayout.module.scss'
import ClientInfoModal from "../ClientInfoModal/ClientInfoModal";
import {useCallsStore} from "../../../stores/callsStore";
import {flattenClientData, getBaseSystemResult} from "../aiJsonBaseSystem";

const CustomerInfoWidget = () => {
    const [openClientInfomodal , setOpenClientInfoModal] = useState(false);
    const currentCallInfo = useCallsStore((state)=> state.currentCallInfo);
    const aiJsonList = useCallsStore((state) => state.aiJsonList);

    const client = useMemo(() => {
        const base = getBaseSystemResult(aiJsonList);
        return flattenClientData(base);
    }, [aiJsonList]);

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
                        <span>{client.имя ?? '-'}</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Телефон клиента</p>
                        <span>{currentCallInfo?.call?.phone_number ? currentCallInfo?.call?.phone_number : '-'}</span>
                    </Flex>
                </Flex>

                <Flex className={styles.GeneralCallInfoColumn}>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Пол</p>
                        <span>{client.пол ?? '-'}</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Место жительства</p>
                        <span>{client.где_живет_клиент ?? '-'}</span>
                    </Flex>
                </Flex>
                <Flex className={styles.GeneralCallInfoColumn}>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Семейное положение</p>
                        <span>{client.семейное_положение ?? '-'}</span>
                    </Flex>
                    <Flex className={styles.GeneralCallInfoColumnItem}>
                        <p>Наличие детей</p>
                        <span>{client.наличие_детей ?? '-'}</span>
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
