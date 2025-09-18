import React from 'react';
import {Flex} from "antd";
import styles from './CallSinglePageLayout.module.scss'
import TextTranscribationWidget from "./widgets/TextTranscribationWidget";
import RecomendationWidget from "./widgets/RecomendationWidget";
import CommentsWidget from "./widgets/CommentsWidget";

const CallTranscribationWidgets = () => {
    return (
        <Flex className={styles.CallTranscribationWidgets}>
            <TextTranscribationWidget/>
            <Flex className={styles.widgetsBlock}>
                <RecomendationWidget/>
                <CommentsWidget/>
            </Flex>
        </Flex>
    );
};

export default CallTranscribationWidgets;