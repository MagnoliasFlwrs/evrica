import React from 'react';
import styles from "../CallsOptions.module.scss";
import {Flex} from "antd";
import CustomSwiper from "../../../ui/CustomSwiper/CustomSwiper";
import CallsOptionsMarkerItem from "./CallsOptionsMarkerItem";


const CallsOptionsMarkers = () => {
    const data = [
        {
            type: "Возражение “Дорого”",
            count: 4
        },
        {
            type: "не хочу",
            count: 1
        },
        {
            type: "Обещали перезвонить",
            count: 8
        },
        {
            type: "не помогли",
            count: 6
        },
        {
            type: "Возражение “Дорого”",
            count: 4
        },
        {
            type: "не хочу",
            count: 1
        },
        {
            type: "Обещали перезвонить",
            count: 8
        },
        {
            type: "не помогли",
            count: 6
        },
    ]
    return (
        <Flex className={styles.CallsOptionsListsContainer}>
            <p>Маркеры</p>
            <CustomSwiper
                data={data}
                renderItem={(item, index) => (
                    <CallsOptionsMarkerItem item={item} key={index} />
                )}
            />
        </Flex>
    );
};

export default CallsOptionsMarkers;