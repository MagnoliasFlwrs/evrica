import React, { useState, useEffect } from 'react';
import { Flex, Input, Tree, TreeDataNode, TreeProps } from "antd";
import styles from './AnalyticsFilter.module.scss'
import {DownOutlined,  SearchOutlined} from "@ant-design/icons";
import {CategoriesFilterProps} from "../CallsLayout/types";
import {treeData} from "./mockData";
import BlueButton from "../ui/BlueButton/BlueButton";
import ReportButton from "./icon/ReportButton";
import {findMatchingKeys, getParentKeys, highlightMatches} from "./utils";
import {useNavigate} from "react-router-dom";

const AnalyticsTree = ({setIsSelected}:CategoriesFilterProps) => {
    const [searchValue, setSearchValue] = useState('');
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0','0-0-0', '0-0-1', '0-0-2']);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [highlightedKeys, setHighlightedKeys] = useState<React.Key[]>([]);
    const navigate = useNavigate();


    useEffect(() => {
        if (searchValue) {
            const matchingKeys = findMatchingKeys(treeData, searchValue);
            setHighlightedKeys(matchingKeys);

            const parentKeys: React.Key[] = [];
            matchingKeys.forEach(key => {
                const parents = getParentKeys(key, treeData);
                parents.forEach(parentKey => {
                    if (!parentKeys.includes(parentKey)) {
                        parentKeys.push(parentKey);
                    }
                });
            });

            setExpandedKeys(prev => {
                const allKeys = [...prev, ...parentKeys];
                const uniqueKeys = allKeys.filter((key, index) => allKeys.indexOf(key) === index);
                return uniqueKeys;
            });
            setAutoExpandParent(true);
        } else {
            setHighlightedKeys([]);
            setExpandedKeys(['0-0','0-0-0', '0-0-1', '0-0-2']);
            setAutoExpandParent(false);
        }
    }, [searchValue]);

    const handleRemoveSelection = () => {
        setCheckedKeys([]);
    };

    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
        setCheckedKeys(checkedKeys as React.Key[]);
        console.log('onCheck', checkedKeys, info);
    };

    const onExpand = (expandedKeys: React.Key[]) => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    const selectedCount = checkedKeys.length;

    useEffect(() => {
        setIsSelected(selectedCount);
    }, [selectedCount]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const treeDataWithHighlights = highlightMatches(treeData, searchValue);

    const handleCreateReport = ()=> {
        navigate('/analytics-report');
    }

    return (
        <Flex className={styles.CategoriesTree}>
            <Flex className={styles.CategoriesTreeHead}>
                <Flex className={styles.CategoriesTreeHeadTitle}>
                    <p>Выберите категорию</p>
                    <Input
                        prefix={<SearchOutlined color='#8C8C8C'/>}
                        placeholder="Поиск по названию"
                        className={styles.CategoriesTreeHeadInput}
                        style={{width: '259px'}}
                        value={searchValue}
                        onChange={handleSearch}
                    />
                </Flex>
                <BlueButton icon={<ReportButton/>} onClick={handleCreateReport} text='Построить отчет' iconPosition='start'/>

            </Flex>
            <Flex className={styles.CategoriesTreeTotal}>

                <Flex className={styles.CategoriesTreeTotalInner}>
                    <span>{selectedCount}</span>
                </Flex>
                <p className={styles.choosen}>Выбрано</p>
                {selectedCount > 0 && (
                    <p className={styles.removeBtn} onClick={handleRemoveSelection}>
                        Снять выделение
                    </p>
                )}
            </Flex>
            <Flex className={styles.CategoriesTreeWidgetContainer}>
            <Tree
                    checkable
                    onSelect={onSelect}
                    onCheck={onCheck}
                    onExpand={onExpand}
                    treeData={treeDataWithHighlights}
                    checkedKeys={checkedKeys}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    className={styles.CategoriesTreeWidget}
                    switcherIcon={<DownOutlined />}
                />
            </Flex>
        </Flex>
    );
};

export default AnalyticsTree;