import React from 'react';
import {Flex} from "antd";
import styles from '../CallsOptions.module.scss'
import CallsOptionsCheckListsItem from "./CallsOptionsCheckListsItem";
import CustomSwiper from "../../../ui/CustomSwiper/CustomSwiper";

const CallsOptionsCheckLists = () => {
    const data = [
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
    return (
        <Flex className={styles.CallsOptionsListsContainer}>
            <p>Чек-листы</p>
            <CustomSwiper
                data={data}
                renderItem={(item, index) => (
                    <CallsOptionsCheckListsItem item={item} key={index} />
                )}
            />
        </Flex>
    );
};

export default CallsOptionsCheckLists;