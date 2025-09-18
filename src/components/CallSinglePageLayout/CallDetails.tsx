import React from 'react';
import {Flex} from "antd";
import styles from './CallSinglePageLayout.module.scss'
import CustomSwiper from "../ui/CustomSwiper/CustomSwiper";
import CallMarkerItem from "./CallSwipersItems/CallMarkerItem";
import CallCheckListsItem from "./CallSwipersItems/CallCheckListsItem";


const CallDetails = () => {
    const checkListData = [
        {
            type:'Компетенции',
            percent:'90%',
            checkListCompleting:4
        },
        {
            type:'Компетенции',
            percent:'67%',
            checkListCompleting:3
        },
        {
            type:'Компетенции',
            percent:'33%',
            checkListCompleting:5
        },
        {
            type:'Компетенции',
            percent:'45%',
            checkListCompleting:5
        },
        {
            type:'Компетенции',
            percent:'50%',
            checkListCompleting:4
        },
        {
            type:'Компетенции',
            percent:'77%',
            checkListCompleting:3
        },
        {
            type:'Компетенции',
            percent:'13%',
            checkListCompleting:5
        },
        {
            type:'Компетенции',
            percent:'95%',
            checkListCompleting:5
        },
    ]
    const markersData = [
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
        <Flex className={styles.CallDetailsContainer}>
            <p className={styles.CallDetailsContainerTile}>Детали разговора</p>
            <p className={styles.CallDetailsContainerSubTile}>Чек-листы</p>
            <CustomSwiper
                data={checkListData}
                renderItem={(item, index) => (
                    <CallCheckListsItem item={item} key={index} />
                )}
            />
            <p className={styles.CallDetailsContainerSubTile}>Маркеры</p>
            <CustomSwiper
                data={markersData}
                renderItem={(item, index) => (
                    <CallMarkerItem item={item} key={index} />
                )}
            />
        </Flex>
    );
};

export default CallDetails;