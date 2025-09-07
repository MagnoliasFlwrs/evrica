import React from 'react';
import {Flex} from "antd";
import styles from './CallsOptions.module.scss'
import CallsOptionsCheckLists from "./CallsOptionsCheckLists/CallsOptionsCheckLists";
import CallsOptionsMarkers from "./CallsOptionsMarkers/CallsOptionsMarkers";

const CallsOptionsContainer = () => {
    return (
        <Flex className={styles.CallsOptionsContainer}>
            <CallsOptionsCheckLists/>
            <CallsOptionsMarkers/>
        </Flex>
    );
};

export default CallsOptionsContainer;