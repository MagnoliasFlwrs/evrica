import React from 'react';
import {Flex} from "antd";
import styles from './CallSinglePageLayout.module.scss'
import GeneralCallInfoWidget from "./widgets/GeneralCallInfoWidget";
import CustomerInfoWidget from "./widgets/CustomerInfoWidget";
import StagesOfConversationWidget from "./widgets/StagesOfConversationWidget";

const CallSinglePageWidgets = () => {
    return (
        <Flex className={styles.CallSinglePageWidgets}>
            <Flex className={styles.CallSinglePageWidgetsColumn}>
                <GeneralCallInfoWidget/>
                <CustomerInfoWidget/>
                <StagesOfConversationWidget/>
            </Flex>
            <Flex className={styles.CallSinglePageWidgetsColumn}>

            </Flex>
        </Flex>
    );
};

export default CallSinglePageWidgets;