import React, { useState, useEffect } from 'react';
import { Flex, Input, Tree, TreeDataNode, TreeProps } from "antd";
import styles from './CategoriesFilter.module.scss'
import {DownOutlined,  SearchOutlined} from "@ant-design/icons";
import {CategoriesFilterProps} from "../types";

const CategoriesTree = ({setIsSelected}:CategoriesFilterProps) => {
    const [searchValue, setSearchValue] = useState('');
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [highlightedKeys, setHighlightedKeys] = useState<React.Key[]>([]);

    const treeData: TreeDataNode[] = [
        {
            title: 'еда',
            key: '0-0',
            children: [
                {
                    title: 'азиатская кухня',
                    key: '0-0-0',
                    children: [
                        {
                            title: 'супы',
                            key: '0-0-0-0',
                            children: [
                                {
                                    title: 'том ям',
                                    key: '0-0-0-0-1',
                                },
                                {
                                    title: 'том кха',
                                    key: '0-0-0-0-2',
                                },
                            ]
                        },
                        {
                            title: 'суши',
                            key: '0-0-0-1',
                            children: [
                                {
                                    title: 'филадельфия',
                                    key: '0-0-0-1-1',
                                },
                                {
                                    title: 'сяке маки',
                                    key: '0-0-0-1-2',
                                },
                            ]
                        },

                    ],
                },
                {
                    title: 'белорусская кухня',
                    key: '0-0-1',
                    children: [
                        {
                            title: 'первое',
                            key: '0-0-1-0',
                            children: [
                                {
                                    title: 'борщ',
                                    key: '0-0-0-0-1',
                                },
                                {
                                    title: 'рассольник',
                                    key: '0-0-0-0-2',
                                },
                            ]
                        },
                        {
                            title: 'горячее',
                            key: '0-0-1-1',
                            children: [
                                {
                                    title: 'колдуны',
                                    key: '0-0-1-1-1',
                                },
                                {
                                    title: 'бефстроганоф',
                                    key: '0-0-1-1-2',
                                },
                            ]
                        },

                    ],
                },
                {
                    title: 'десерты',
                    key: '0-0-2',
                    children: [
                        {
                            title: 'шоколадные',
                            key: '0-0-2-0',
                            children: [
                                {
                                    title: 'брауни',
                                    key: '0-0-2-0-1',
                                },
                                {
                                    title: 'торт',
                                    key: '0-0-2-0-2',
                                },
                            ]
                        },
                        {
                            title: 'ягодные',
                            key: '0-0-2-1',
                            children: [
                                {
                                    title: 'ягодня слойка',
                                    key: '0-0-2-1-1',
                                },
                                {
                                    title: 'мармелад',
                                    key: '0-0-2-1-2',
                                },
                            ]
                        },

                    ],
                },
            ],
        },
    ];

    const findMatchingKeys = (data: TreeDataNode[], searchText: string): React.Key[] => {
        if (!searchText) return [];

        const matches: React.Key[] = [];

        const searchRecursive = (nodes: TreeDataNode[]) => {
            nodes.forEach(item => {
                const titleMatch = item.title?.toString().toLowerCase().includes(searchText.toLowerCase());
                if (titleMatch) {
                    matches.push(item.key as React.Key);
                }
                if (item.children) {
                    searchRecursive(item.children);
                }
            });
        };

        searchRecursive(data);
        return matches;
    };

    const getParentKeys = (key: React.Key, data: TreeDataNode[], currentPath: React.Key[] = []): React.Key[] => {
        for (const item of data) {
            if (item.key === key) {
                return currentPath;
            }

            if (item.children) {
                const found = getParentKeys(key, item.children, [...currentPath, item.key as React.Key]);
                if (found.length > 0) {
                    return found;
                }
            }
        }
        return [];
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

            setExpandedKeys(parentKeys);
            setAutoExpandParent(true);
        } else {
            setHighlightedKeys([]);
            setExpandedKeys([]);
            setAutoExpandParent(false);
        }
    }, [searchValue]);

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
                />
            </Flex>

        </Flex>
    );
};

export default CategoriesTree;