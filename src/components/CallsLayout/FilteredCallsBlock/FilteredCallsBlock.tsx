import React from 'react';
import {Flex} from "antd";
import styles from './FilteredCallsBlock.module.scss'
import {CategoriesFilterSelectedState} from "../types";

const FilteredCallsBlock = ({isSelected}: CategoriesFilterSelectedState) => {
    return (
        <Flex className={styles.FilteredCallsBlock}>
            {
                isSelected > 0 ?
                    <Flex className={styles.SelectedCalls}>
                        <p>Найдено 167 звонков</p>
                        <a href="/calls/filtered">Просмотреть список звонков</a>
                    </Flex>
                    :
                    <p>Для просмотра звонков необходимо выбрать категорию</p>

            }
        </Flex>
    );
};

export default FilteredCallsBlock;