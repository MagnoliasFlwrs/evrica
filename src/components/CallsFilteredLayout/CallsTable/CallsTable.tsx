import React, {useState, useMemo, useEffect} from 'react';
import {ConfigProvider, Flex, Pagination, Table, Tag, Typography} from "antd";
import { data, formatDate } from "./utils";
import styles from '../CallsFilteredLayout.module.scss';
import CustomPaginationSelect from "../../ui/CustomPaginationSelect/CustomPaginationSelect";
import {useNavigate} from "react-router-dom";

const { Text } = Typography;

export interface TableRecord {
    key: string;
    id: string;
    callType: string;
    date: string;
    duration: string;
    phone: string;
    userName: string;
    checklists: string[];
    markers: Array<{ value: string; label: string }>;
}

const CallsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [visibleChecklistIndex, setVisibleChecklistIndex] = useState<number | null>(null);
    const [visibleMarkerslistIndex, setVisibleMarkerslistIndex] = useState<number | null>(null);

    const navigate = useNavigate();

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    }, [currentPage, pageSize, data]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            setVisibleChecklistIndex(null);

        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            setVisibleMarkerslistIndex(null);

        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 161,
            render: (text: string, record: TableRecord) => {
                return <span className={styles.tableText}>{text}</span>;
            }
        },
        {
            title: 'Тип звонка',
            dataIndex: 'callType',
            key: 'callType',
            sorter: true,
            render: (text: string, record: TableRecord) => {
                return <span className={styles.tableText}>{text}</span>;
            }
        },
        {
            title: 'Дата звонка',
            dataIndex: 'date',
            key: 'date',
            width: 170,
            render: (text: string, record: TableRecord) => (
                <p className={styles.tableTextDate}>
                    {formatDate(record.date, 'date-only')}
                    <span>{formatDate(record.date, 'time-only')}</span>
                </p>
            )
        },
        {
            title: 'Длительность звонка',
            dataIndex: 'duration',
            key: 'duration',
            sorter: true,
            render: (text: string, record: TableRecord) => {
                return <span className={styles.tableText}>{text}</span>;
            }
        },
        {
            title: 'Телефон клиента',
            dataIndex: 'phone',
            key: 'phone',
            render: (text: string, record: TableRecord) => {
                return <span className={styles.tableText}>{text}</span>;
            }
        },
        {
            title: 'Имя клиента',
            dataIndex: 'userName',
            key: 'userName',
            sorter: true,
            render: (text: string, record: TableRecord) => {
                return <span className={styles.tableText}>{text}</span>;
            }
        },
        {
            title: 'Чек-листы',
            dataIndex: 'checklists',
            key: 'checklists',
            render: (checklists: string[], record: any, index: number) => (
                checklists.length === 1 ? (
                    <span className={styles.checklistItem}>{checklists[0]}</span>
                ) : (
                    <Flex
                        className={styles.manyItemsContainer}
                        onClick={(e) => {
                            e.stopPropagation();
                            setVisibleChecklistIndex(visibleChecklistIndex === index ? null : index);
                            setVisibleMarkerslistIndex(null);
                        }}
                        style={{ cursor: 'pointer', position: 'relative' }}
                    >
                        <span className={styles.checklistItemLength}>{`${checklists.length}`}</span>
                        {visibleChecklistIndex === index && (
                            <Flex className={styles.manyItemsContainerModal}>
                                {checklists.map((item, i) => (
                                    <span className={styles.checklistItem} key={i}>{item}</span>
                                ))}
                            </Flex>
                        )}
                    </Flex>
                )
            )
        },
        {
            title: 'Маркеры',
            dataIndex: 'markers',
            key: 'markers',
            render: (markers: Array<{ value: string; label: string }>, record: TableRecord, index: number) => (
                markers.length === 1 ? (
                    <Tag className={`${styles.tag} ${styles[markers[0].value]}`}>
                        {markers[0].label}
                    </Tag>
                ) : (
                    <Flex
                        className={styles.manyItemsContainer}
                        onClick={(e) => {
                            e.stopPropagation();
                            setVisibleMarkerslistIndex(visibleMarkerslistIndex === index ? null : index);
                            setVisibleChecklistIndex(null);
                        }}
                        style={{ cursor: 'pointer', position: 'relative' }}
                    >
                        <span className={styles.markerItemLength}>{`${markers.length}`}</span>
                        {visibleMarkerslistIndex === index && (
                            <Flex className={styles.manyItemsContainerModal}>
                                {markers.map((marker, i) => (
                                    <Tag
                                        className={`${styles.tag} ${styles[marker.value]}`}
                                        key={marker.value}
                                    >
                                        {marker.label}
                                    </Tag>
                                ))}
                            </Flex>
                        )}
                    </Flex>
                )
            )
        }
    ];
    const customFooter = () => (

        <Flex
            justify="space-between"
            align="center"
            className={styles.CustomFooter}
        >
            <Flex align="center" gap='32px'>
                <Flex align="center" >
                    <Text strong>Показать:</Text>
                    <CustomPaginationSelect
                        value={pageSize.toString()}
                        onChange={(value) => {
                            setPageSize(Number(value));
                            setCurrentPage(1);
                        }}
                        options={[
                            { value: '10', label: '10' },
                            { value: '20', label: '20' },
                            { value: '30', label: '30' },
                        ]}
                    />
                </Flex>
                <Text>
                    <Text strong>Найдено:</Text> {data.length}
                </Text>
            </Flex>

            <Flex align="center" gap="middle" className={styles.CustomPagination}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={data.length}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper={false}
                    showLessItems
                />
            </Flex>
        </Flex>
    );

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        headerBg: '#F3F3F3',
                        headerBorderRadius: 16,
                        borderColor: 'rgba(0, 0, 0, 0.10)',
                        cellPaddingInlineSM:16,
                        cellPaddingInlineMD:16
                    },
                    Pagination : {
                        itemActiveBg:'#007AFF'
                    }
                },
            }}
        >
            <Table
                columns={columns}
                dataSource={paginatedData}
                className={styles.CallsTable}
                pagination={false}
                footer={customFooter}
                onRow={(record: TableRecord) => ({
                    onClick: () => {
                        navigate(`/call/:id?${record.id}`);
                    },
                    style: {
                        cursor: 'pointer',
                    },
                })}
            />
        </ConfigProvider>
    );
};

export default CallsTable;