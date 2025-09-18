import React from 'react';
import {Flex} from "antd";
import styles from './CallSinglePageLayout.module.scss'
import GeneralCallInfoWidget from "./widgets/GeneralCallInfoWidget";
import CustomerInfoWidget from "./widgets/CustomerInfoWidget";
import StagesOfConversationWidget from "./widgets/StagesOfConversationWidget";
import SummaryOfCallInformationWidget from "./widgets/SummaryOfCallInformationWidget";

const CallSinglePageWidgets = () => {
    return (
        <Flex className={styles.CallSinglePageWidgets}>
            <Flex className={styles.CallSinglePageWidgetsColumn}>
                <GeneralCallInfoWidget/>
                <CustomerInfoWidget/>
                <StagesOfConversationWidget/>
            </Flex>
            <Flex className={styles.CallSinglePageWidgetsColumn}>
                <SummaryOfCallInformationWidget/>
            </Flex>
        </Flex>
    );
};

export default CallSinglePageWidgets;