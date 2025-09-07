import React from 'react';
import {Flex, TreeDataNode} from "antd";
import CategoriesTree from "./CategoriesTree";
import CategoriesDatePicker from "./CategoriesDatePicker";
import styles from "./CategoriesFilter.module.scss";
import {CategoriesFilterProps} from "../types";

const CategoriesFilter = ({setIsSelected}:CategoriesFilterProps) => {
    const onDateRangeSelect = () => {
        console.log("onDateRangeSelect");
    }

    return (
        <Flex className={styles.CategoriesFilterContainer}>
            <CategoriesTree setIsSelected={setIsSelected}/>
            <CategoriesDatePicker/>
        </Flex>
    );
};

export default CategoriesFilter;