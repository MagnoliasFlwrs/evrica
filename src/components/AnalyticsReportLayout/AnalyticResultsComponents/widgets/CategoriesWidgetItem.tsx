import React from 'react';
import {Flex} from "antd";
import styles from '../../AnalyticsReportLayout.module.scss'

interface CategoriesWidgetItemProps {
    title: string;
    checkListsPercent: number;
    negativeDictionary: number;
    positiveDictionary: number;
    onDelete: () => void;
}

const CategoriesWidgetItem = ({title , checkListsPercent , negativeDictionary , positiveDictionary, onDelete}: CategoriesWidgetItemProps) => {

    const getCheckListClass = (percent: number) => {
        if (percent < 45) return styles.red;
        if (percent >= 46 && percent <= 85) return styles.yellow;
        if (percent >= 86 && percent <= 100) return styles.green;
        return '';
    }

    return (
        <Flex className={styles.CategoriesWidgetItem}>
            <p className={styles.CategoriesWidgetItemTitle}>{title}</p>
            <ul>
                <li>
                    <p>Чек-листы</p>
                    <span className={`${styles.CheckListsText} ${getCheckListClass(checkListsPercent)}`}>
                        {checkListsPercent} %
                    </span>
                </li>
                <li>
                    <p>Негативные словари</p>
                    <span className={`${styles.DictionaryText} ${negativeDictionary > 0 ? styles.negative : ''}`}>
                        {negativeDictionary}
                    </span>
                </li>
                <li>
                    <p>Позитивные словари</p>
                    <span className={`${styles.DictionaryText} ${positiveDictionary > 0 ? styles.positive : ''}`}>
                        {positiveDictionary}
                    </span>
                </li>
            </ul>
            <button className={styles.DeleteBtn} onClick={onDelete}>
                <span className={styles.DeleteIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3.33337 8H12.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
                <p>Удалить из анализа</p>
            </button>
        </Flex>
    );
};

export default CategoriesWidgetItem;