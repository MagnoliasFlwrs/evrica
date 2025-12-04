import React, {useEffect, useState} from 'react';
import {Flex} from "antd";
import styles from './FilteredCallsBlock.module.scss'
import {CategoriesFilterSelectedState} from "../types";
import {useCallsStore} from "../../../stores/callsStore";

const FilteredCallsBlock = ({isSelected}: CategoriesFilterSelectedState) => {
    const callsByCategory = useCallsStore((state)=>state.callsByCategory);
    const callsByCategories = useCallsStore((state)=>state.callsByCategories);
    const [callsCount , setCallsCount] = useState(0);

    useEffect(() => {
        if (callsByCategories && callsByCategories?.paginator) {
            setCallsCount(callsByCategories?.paginator?.totalCount);
        } else {
            setCallsCount(0);
        }
        console.log(callsByCategories)
    }, [callsByCategories]);

    return (
        <Flex className={styles.FilteredCallsBlock}>
            {
                isSelected > 0 ?
                    <Flex className={styles.SelectedCalls}>
                        <p>Найдено {callsCount} звонков</p>
                        <a href="/calls/filtered">Просмотреть список звонков</a>
                    </Flex>
                    :
                    <p>Для просмотра звонков необходимо выбрать категорию</p>
            }
        </Flex>
    );
};

export default FilteredCallsBlock;