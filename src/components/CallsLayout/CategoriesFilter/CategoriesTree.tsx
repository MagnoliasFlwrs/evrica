import React, { useState, useEffect, useMemo } from 'react';
import { Flex, Input, Tree, TreeDataNode, TreeProps } from "antd";
import styles from './CategoriesFilter.module.scss'
import {DownOutlined,  SearchOutlined} from "@ant-design/icons";
import {CategoriesFilterProps} from "../types";
import {useCallsStore} from "../../../stores/callsStore";
import { findCategoryIdsInTree} from "./helpers";
import {Category, CategoryLocation, SubLocation} from "./types";


const CategoriesTree = ({setIsSelected}: CategoriesFilterProps) => {
    const [searchValue, setSearchValue] = useState('');
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [highlightedKeys, setHighlightedKeys] = useState<React.Key[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const callsCategories = useCallsStore((state) => state.callsCategories);
    const setCategoryId = useCallsStore((state)=> state.setCategoryId);

    const selectedCount = selectedCategoryIds.length;
    const convertToTreeData = (categories: CategoryLocation[]): TreeDataNode[] => {
        return categories?.map((location: CategoryLocation) => ({
            title: location.name,
            key: `location-${location.id}`,
            children: location.sub_locations?.map((subLocation: SubLocation) => ({
                title: subLocation.name,
                key: `sublocation-${subLocation.id}`,
                children: subLocation.categories?.map((category: Category) => ({
                    title: category.name,
                    key: `category-${category.id}`,
                    id: category.id,
                })) || [],
            })) || [],
        }));
    };
    const highlightMatches = (data: TreeDataNode[], searchText: string): TreeDataNode[] => {
        if (!searchText) return data;

        return data.map(item => {
            const newItem = { ...item };
            const titleMatch = newItem.title?.toString().toLowerCase().includes(searchText.toLowerCase());

            if (titleMatch && newItem.title) {
                const titleStr = newItem.title.toString();
                const index = titleStr.toLowerCase().indexOf(searchText.toLowerCase());
                const beforeStr = titleStr.substring(0, index);
                const matchStr = titleStr.substring(index, index + searchText.length);
                const afterStr = titleStr.substring(index + searchText.length);

                newItem.title = (
                    <span style={{ backgroundColor: highlightedKeys.includes(newItem.key as React.Key) ? '#fffb8f' : 'transparent' }}>
                        {beforeStr}
                        <span style={{ color: '#f50', fontWeight: 'bold' }}>{matchStr}</span>
                        {afterStr}
                    </span>
                );
            }

            if (newItem.children) {
                newItem.children = highlightMatches(newItem.children, searchText);
            }

            return newItem;
        });
    };


    const treeData: TreeDataNode[] = useMemo(() => {
        return convertToTreeData(callsCategories);
    }, [callsCategories]);

    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);

        // Получаем ID категорий из выбранных ключей
        const categoryIds = findCategoryIdsInTree(selectedKeys as React.Key[], treeData);
        setSelectedCategoryIds(categoryIds);

        // Берем первую выбранную категорию (так как можно выбрать только одну)
        if (categoryIds.length > 0) {
            const firstCategoryId = categoryIds[0];
            setCategoryId(firstCategoryId);
            console.log('Set category ID in store:', firstCategoryId);
        } else {
            // Если ничего не выбрано, сбрасываем category_id
            setCategoryId('');
            console.log('Reset category ID in store');
        }

        console.log('Selected category IDs:', categoryIds);
    };

    const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
        setCheckedKeys(checkedKeys as React.Key[]);
        console.log('onCheck', checkedKeys, info);

        const categoryIds = findCategoryIdsInTree(checkedKeys as React.Key[], treeData);
        setSelectedCategoryIds(categoryIds);

        // Также обновляем category_id в store при выборе чекбоксами
        if (categoryIds.length > 0) {
            const firstCategoryId = categoryIds[0];
            setCategoryId(firstCategoryId);
            console.log('Set category ID in store (checkbox):', firstCategoryId);
        } else {
            setCategoryId('');
            console.log('Reset category ID in store (checkbox)');
        }

        console.log('Checked category IDs:', categoryIds);
    };

    const onExpand = (expandedKeys: React.Key[]) => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    useEffect(() => {
        setIsSelected(selectedCount);
    }, [selectedCount]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const treeDataWithHighlights = highlightMatches(treeData, searchValue);

    return (
        <Flex className={styles.CategoriesTree}>
            <Flex className={styles.CategoriesTreeHead}>
                <p>Выберите категорию</p>
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Поиск по названию"
                    className={styles.CategoriesTreeHeadInput}
                    style={{ width: '259px' }}
                    value={searchValue}
                    onChange={handleSearch}
                />
            </Flex>
            <Flex className={styles.CategoriesTreeTotal}>
                <Flex className={styles.CategoriesTreeTotalInner}>
                    <span>{selectedCount}</span>
                </Flex>
                <p>Выбрано</p>
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
                    // Делаем возможность выбора только одного элемента
                    selectable={true}
                />
            </Flex>
        </Flex>
    );
};

export default CategoriesTree;