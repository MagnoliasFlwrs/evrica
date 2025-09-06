import React from 'react';
import {Flex, TreeDataNode} from "antd";
import CategoriesTree from "./CategoriesTree";
import CategoriesDatePicker from "./CategoriesDatePicker";
import styles from "./CategoriesFilter.module.scss";

const CategoriesFilter = () => {

    return (
        <Flex className={styles.CategoriesFilterContainer}>
            <CategoriesTree/>
            <CategoriesDatePicker/>
        </Flex>
    );
};

export default CategoriesFilter;