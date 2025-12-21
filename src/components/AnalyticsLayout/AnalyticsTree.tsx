import React, { useState, useEffect } from 'react';
import { Flex, Input, Tree, TreeDataNode, TreeProps } from "antd";
import styles from './AnalyticsFilter.module.scss'
import {DownOutlined,  SearchOutlined} from "@ant-design/icons";
import {CategoriesFilterProps} from "../CallsLayout/types";
import BlueButton from "../ui/BlueButton/BlueButton";
import ReportButton from "./icon/ReportButton";
import {findMatchingKeys, getParentKeys, highlightMatches} from "./utils";
import {useNavigate} from "react-router-dom";
import {useAnalyticsStore} from "../../stores/analyticsStore";

const transformAgentsToTreeData = (agentsData: any[]): TreeDataNode[] => {
    return agentsData
        .filter(location =>
            location.sub_locations?.some((subLoc: any) =>
                subLoc.categories?.some((category: any) =>
                    category.agents && category.agents.length > 0
                )
            )
        )
        .map(location => {
            const subLocationNodes = location.sub_locations
                .filter((subLoc: any) =>
                    subLoc.categories?.some((category: any) =>
                        category.agents && category.agents.length > 0
                    )
                )
                .map((subLoc: any) => {
                    const categoryNodes = subLoc.categories
                        .filter((category: any) => category.agents && category.agents.length > 0)
                        .map((category: any) => {
                            const agentNodes = category.agents.map((agent: any) => ({
                                key: `agent-${category.id}-${agent.agent_name}`,
                                id:category.id,
                                title: agent.agent_name.replace(/"/g, ''),
                                isLeaf: true,
                                agentName: agent.agent_name.replace(/"/g, ''),
                            }));

                            return {
                                key: `category-${category.id}`,
                                id:category.id,
                                title: category.name,
                                children: agentNodes,
                            };
                        });

                    return {
                        key: `subloc-${subLoc.id}`,
                        id:subLoc.id,
                        title: subLoc.name,
                        children: categoryNodes,
                    };
                });

            return {
                key: `loc-${location.id}`,
                id:location.id,
                title: location.name,
                children: subLocationNodes,
            };
        });
};

const getAgentNameByKey = (treeData: TreeDataNode[], key: React.Key): string | null => {
    for (const location of treeData) {
        if (location.children) {
            for (const subLoc of location.children) {
                if (subLoc.children) {
                    for (const category of subLoc.children) {
                        if (category.children) {
                            for (const agent of category.children) {
                                if (agent.key === key && (agent as any).agentName) {
                                    return (agent as any).agentName;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return null;
};

const getAgentNamesByKeys = (treeData: TreeDataNode[], keys: React.Key[]): string[] => {
    const agentNames: string[] = [];
    keys.forEach(key => {
        const agentName = getAgentNameByKey(treeData, key);
        if (agentName) {
            agentNames.push(agentName);
        }
    });
    return agentNames;
};

const getAllChildKeys = (node: TreeDataNode): React.Key[] => {
    let keys: React.Key[] = [node.key as React.Key];

    if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
            keys = keys.concat(getAllChildKeys(child));
        });
    }

    return keys;
};

// Функция для получения всех ключей, которые нужно развернуть при выборе узла
const getExpandedKeysForNode = (nodeKey: React.Key, treeData: TreeDataNode[]): React.Key[] => {
    const keysToExpand: React.Key[] = [nodeKey];

    // Находим узел в дереве
    const findNode = (nodes: TreeDataNode[], targetKey: React.Key): TreeDataNode | null => {
        for (const node of nodes) {
            if (node.key === targetKey) {
                return node;
            }
            if (node.children) {
                const found = findNode(node.children, targetKey);
                if (found) return found;
            }
        }
        return null;
    };

    const node = findNode(treeData, nodeKey);

    // Если у узла есть дети, добавляем все дочерние ключи для разворачивания
    if (node && node.children && node.children.length > 0) {
        node.children.forEach(child => {
            keysToExpand.push(child.key as React.Key);
            // Рекурсивно добавляем детей детей
            if (child.children && child.children.length > 0) {
                const childKeys = getAllChildKeys(child).slice(1); // Исключаем сам child.key, так как он уже добавлен
                keysToExpand.push(...childKeys);
            }
        });
    }

    return keysToExpand;
};

// Функция для создания кастомного title с обработчиком клика
const createCustomTitle = (node: TreeDataNode, originalTitle: React.ReactNode, onTitleClick: (node: TreeDataNode) => void) => {
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


const getActualTitle = (node: TreeDataNode): React.ReactNode => {
    if (typeof node.title === 'function') {
        return node.title(node as TreeDataNode);
    }
    return node.title;
};

const AnalyticsTree = ({setIsSelected}: CategoriesFilterProps) => {
    const [searchValue, setSearchValue] = useState('');
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [selectedAgentNames, setSelectedAgentNames] = useState<string[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [highlightedKeys, setHighlightedKeys] = useState<React.Key[]>([]);
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const navigate = useNavigate();
    const allAgents = useAnalyticsStore((state)=> state.allAgents);
    const setAgentName = useAnalyticsStore((state)=> state.setAgentName);
    const setCategoryId = useAnalyticsStore((state)=> state.setCategoryId);


    useEffect(() => {
        if (allAgents && allAgents.length > 0) {
            console.log(allAgents)
            const transformedData = transformAgentsToTreeData(allAgents);
            console.log(transformedData)
            setTreeData(transformedData);

            const firstLevelKeys = transformedData.map(item => item.key);
            setExpandedKeys(firstLevelKeys);
        }
    }, [allAgents]);

    useEffect(() => {
        if (treeData.length > 0 && checkedKeys.length > 0) {
            const names = getAgentNamesByKeys(treeData, checkedKeys);
            setSelectedAgentNames(names);
        } else {
            setSelectedAgentNames([]);
        }
        console.log(treeData)
    }, [checkedKeys, treeData]);

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
            const firstLevelKeys = treeData.map(item => item.key);
            setExpandedKeys(firstLevelKeys);
            setAutoExpandParent(false);
        }
    }, [searchValue, treeData]);

    const handleRemoveSelection = () => {
        setCheckedKeys([]);
        setSelectedAgentNames([]);
    };

    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
        setCheckedKeys(checkedKeys as React.Key[]);
        console.log('onCheck', checkedKeys, info);

        if (treeData.length > 0) {
            const names = getAgentNamesByKeys(treeData, checkedKeys as React.Key[]);
            setSelectedAgentNames(names);
            console.log('Selected agent names:', names);
        }

        if (info.checked && info.node) {
            const keysToExpand = getExpandedKeysForNode(info.node.key as React.Key, treeData);

            setExpandedKeys(prev => {
                const newExpandedKeys = [...prev];
                keysToExpand.forEach(key => {
                    if (!newExpandedKeys.includes(key)) {
                        newExpandedKeys.push(key);
                    }
                });
                return newExpandedKeys;
            });

            setAutoExpandParent(false);
        }
    };

    const onExpand = (expandedKeys: React.Key[]) => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    const onTitleClick = (node: TreeDataNode) => {
        const key = node.key as React.Key;

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

    const selectedCount = checkedKeys.length;

    useEffect(() => {
        setIsSelected(selectedCount);
    }, [selectedCount]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    // Обновляем treeData с кастомными title для обработки кликов
    const treeDataWithHighlightsAndCustomTitles = React.useMemo(() => {
        const highlightedData = highlightMatches(treeData, searchValue);

        // Рекурсивно добавляем кастомные title
        const addCustomTitles = (nodes: TreeDataNode[]): TreeDataNode[] => {
            return nodes.map(node => {
                const actualTitle = getActualTitle(node);
                return {
                    ...node,
                    title: createCustomTitle(node, actualTitle, onTitleClick),
                    children: node.children ? addCustomTitles(node.children) : undefined
                };
            });
        };

        return addCustomTitles(highlightedData);
    }, [treeData, searchValue, expandedKeys]);

    const handleCreateReport = () => {
        console.log('Creating report with agents:', selectedAgentNames);
        navigate('/analytics-report', {
            state: { selectedAgents: selectedAgentNames }
        });
    }

    useEffect(() => {
        console.log('Currently selected agents:', selectedAgentNames);
    }, [selectedAgentNames]);

    console.log(treeData)

    return (
        <Flex className={styles.CategoriesTree}>
            <Flex className={styles.CategoriesTreeHead}>
                <Flex className={styles.CategoriesTreeHeadTitle}>
                    <p>Выберите сотрудников</p>
                    <Input
                        prefix={<SearchOutlined color='#8C8C8C'/>}
                        placeholder="Поиск по сотруднику"
                        className={styles.CategoriesTreeHeadInput}
                        style={{width: '259px'}}
                        value={searchValue}
                        onChange={handleSearch}
                    />
                </Flex>
                <BlueButton
                    icon={<ReportButton/>}
                    onClick={handleCreateReport}
                    text='Построить отчет'
                    iconPosition='start'
                />
            </Flex>
            <Flex className={styles.CategoriesTreeTotal}>
                <Flex className={selectedCount > 0 ? styles.CategoriesTreeTotalInnerActive : styles.CategoriesTreeTotalInner}>
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
                {treeData.length > 0 ? (
                    <Tree
                        checkable
                        onSelect={onSelect}
                        onCheck={onCheck}
                        onExpand={onExpand}
                        treeData={treeDataWithHighlightsAndCustomTitles}
                        checkedKeys={checkedKeys}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        className={styles.CategoriesTreeWidget}
                        switcherIcon={<DownOutlined />}
                        expandAction={false}
                    />
                ) : (
                    <p>Загрузка данных...</p>
                )}
            </Flex>
        </Flex>
    );
};

export default AnalyticsTree;