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
                                title: agent.agent_name.replace(/"/g, ''),
                                isLeaf: true,
                                agentName: agent.agent_name.replace(/"/g, ''),
                            }));

                            return {
                                key: `category-${category.id}`,
                                title: category.name,
                                children: agentNodes,
                            };
                        });

                    return {
                        key: `subloc-${subLoc.id}`,
                        title: subLoc.name,
                        children: categoryNodes,
                    };
                });

            return {
                key: `loc-${location.id}`,
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

    useEffect(() => {
        if (allAgents && allAgents.length > 0) {
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
                {treeData.length > 0 ? (
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
                ) : (
                    <p>Загрузка данных...</p>
                )}
            </Flex>
        </Flex>
    );
};

export default AnalyticsTree;