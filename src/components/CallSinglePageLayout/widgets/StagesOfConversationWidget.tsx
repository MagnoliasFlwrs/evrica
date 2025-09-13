import React from 'react';
import {Flex} from "antd";
import styles from '../CallSinglePageLayout.module.scss'
import CustomProgress from "../../ui/CustomProgress/CustomProgress";

const StagesOfConversationWidget = () => {
    return (
        <Flex className={styles.StagesOfConversationWidget}>
            <Flex className={styles.GeneralCallInfoWidgetHead}>
                <p className={styles.CallWidgetTitle}>Этапы разговора</p>
            </Flex>
            <Flex className={styles.StagesOfConversation}>
                <CustomProgress percent={50} title='Приветствие'/>
                <CustomProgress percent={100} title='Идентификация клиента'/>
                <CustomProgress percent={50} title='Выявление потребности'/>
                <CustomProgress percent={50} title='Презентация решений'/>
                <CustomProgress percent={70} title='Работа с возражениями'/>
                <CustomProgress percent={64} title='Подведение итогов'/>
                <CustomProgress percent={0} title='Завершение разговора'/>
            </Flex>
        </Flex>
    );
};

export default StagesOfConversationWidget;