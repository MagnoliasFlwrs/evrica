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
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]); // Для чекбоксов (теперь только один)
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
                    isLeaf: true, // Помечаем конечные узлы
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

    // Обработчик для чекбоксов (теперь с单选 логикой)
    const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
        // Проверяем, что выбрана именно категория (конечный узел)
        const node = info.node;

        // Разрешаем выбирать только конечные узлы (категории)
        if (!node.isLeaf) {
            return; // Игнорируем выбор промежуточных узлов
        }

        // Получаем новый массив выбранных ключей
        const newCheckedKeys = checkedKeys as React.Key[];

        // Оставляем только последний выбранный элемент (для单选)
        // Если что-то уже выбрано и выбрали новый элемент
        if (newCheckedKeys.length > 1) {
            // Берем последний выбранный элемент (который только что выбрали)
            const lastChecked = newCheckedKeys[newCheckedKeys.length - 1];
            setCheckedKeys([lastChecked]);

            // Обновляем ID категорий
            const categoryIds = findCategoryIdsInTree([lastChecked], treeData);
            setSelectedCategoryIds(categoryIds);

            // Обновляем store
            if (categoryIds.length > 0) {
                setCategoryId(categoryIds[0]);
                console.log('Set category ID in store (checkbox):', categoryIds[0]);
            }
        } else {
            // Если ничего не выбрано или выбран один элемент
            setCheckedKeys(newCheckedKeys);

            const categoryIds = findCategoryIdsInTree(newCheckedKeys, treeData);
            setSelectedCategoryIds(categoryIds);

            if (categoryIds.length > 0) {
                setCategoryId(categoryIds[0]);
                console.log('Set category ID in store (checkbox):', categoryIds[0]);
            } else {
                setCategoryId('');
                console.log('Reset category ID in store (checkbox)');
            }
        }

        console.log('Checked category IDs:', selectedCategoryIds);
    };

    // Обработчик для выделения (используем только для дополнительной информации)
    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        // Не меняем состояние чекбоксов при выделении
    };

    const onExpand = (expandedKeys: React.Key[]) => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    // Обработчик клика на заголовок для разворачивания/сворачивания
    const onTitleClick = (node: TreeDataNode) => {
        const key = node.key as React.Key;

        // Если у узла есть дети, обрабатываем разворачивание/сворачивание
        if (node.children && node.children.length > 0) {
            if (expandedKeys.includes(key)) {
                // Сворачиваем
                setExpandedKeys(expandedKeys.filter(k => k !== key));
            } else {
                // Разворачиваем
                setExpandedKeys([...expandedKeys, key]);
            }
            setAutoExpandParent(false);
        }
    };

    useEffect(() => {
        setIsSelected(selectedCount);
    }, [selectedCount]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    // Функция для получения фактического title
    const getActualTitle = (node: TreeDataNode): React.ReactNode => {
        if (typeof node.title === 'function') {
            return node.title(node as TreeDataNode);
        }
        return node.title;
    };

    // Функция для создания кастомного title с обработчиком клика
    const createCustomTitle = (node: TreeDataNode, originalTitle: React.ReactNode) => {
        const hasChildren = node.children && node.children.length > 0;

        return (
            <span
                onClick={(e) => {
                    e.stopPropagation();
                    if (hasChildren) {
                        onTitleClick(node);
                    }
                }}
                style={{
                    cursor: hasChildren ? 'pointer' : 'default',
                    display: 'inline-block',
                    width: '100%',
                    padding: '2px 0'
                }}
            >
                {originalTitle}
            </span>
        );
    };

    const treeDataWithHighlights = useMemo(() => {
        const highlightedData = highlightMatches(treeData, searchValue);

        // Рекурсивно добавляем кастомные title
        const addCustomTitles = (nodes: TreeDataNode[]): TreeDataNode[] => {
            return nodes.map(node => {
                const actualTitle = getActualTitle(node);
                return {
                    ...node,
                    title: createCustomTitle(node, actualTitle),
                    children: node.children ? addCustomTitles(node.children) : undefined
                };
            });
        };

        return addCustomTitles(highlightedData);
    }, [treeData, searchValue, expandedKeys]);

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
                    selectable={true}
                    expandAction={false}
                />
            </Flex>
        </Flex>
    );
};

export default CategoriesTree;