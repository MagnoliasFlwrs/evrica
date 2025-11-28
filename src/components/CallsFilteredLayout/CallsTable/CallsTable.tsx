import React, {useState, useEffect} from 'react';
import {ConfigProvider, Flex, Pagination, Table, Tag, Typography} from "antd";
import { formatDate } from "./utils";
import styles from '../CallsFilteredLayout.module.scss';
import CustomPaginationSelect from "../../ui/CustomPaginationSelect/CustomPaginationSelect";
import {useNavigate} from "react-router-dom";
import {useCallsStore} from "../../../stores/callsStore";
import {Call} from "../../../stores/types/callsStoreTypes";
import {ColumnsType} from "antd/lib/table";

const { Text } = Typography;

const CallsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [visibleChecklistIndex, setVisibleChecklistIndex] = useState<number | null>(null);
    const [visibleMarkerslistIndex, setVisibleMarkerslistIndex] = useState<number | null>(null);

    const [data, setData] = useState<Call[]>([]);
    const callsByCategory = useCallsStore((state)=>state.callsByCategory);
    const loading = useCallsStore((state)=>state.loading);
    const setCurrentCallId = useCallsStore((state)=>state.setCurrentCallId);
    const setCategoryCallsListObjPage = useCallsStore((state)=>state.setCategoryCallsListObjPage);
    const setCategoryCallsListObjPerPage = useCallsStore((state)=>state.setCategoryCallsListObjPerPage);

    useEffect(() => {
        if(callsByCategory?.data?.calls) {
            setData(callsByCategory.data.calls);
        }
    }, [callsByCategory]);

    const navigate = useNavigate();

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setCategoryCallsListObjPage(page);
    };


    const handlePageSizeChange = (value: string) => {
        const newPageSize = Number(value);
        setPageSize(newPageSize);
        setCurrentPage(1);
        setCategoryCallsListObjPerPage(newPageSize);
        setCategoryCallsListObjPage(1);
    };

    const columns: ColumnsType<Call> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 161,
            render: (text: string, record: Call) => {
                return <span className={styles.tableText}>{text}</span>;
            }
        },
        {
            title: 'Тип звонка',
            dataIndex: 'call_type',
            key: 'call_type',
            // sorter: true,
            render: (text: string, record: Call) => {
                const callTypeMap: { [key: string]: string } = {
                    'in': 'Входящий',
                    'out': 'Исходящий'
                };

                const displayText = callTypeMap[text] || text;
                return <span className={styles.tableText}>{displayText}</span>;
            }
        },
        {
            title: 'Дата звонка',
            dataIndex: 'date_call',
            key: 'date_call',
            width: 170,
            render: (text: string, record: Call) => (
                <p className={styles.tableTextDate}>
                    {formatDate(record.date_call, 'date-only')}
                    <span>{formatDate(record.date_call, 'time-only')}</span>
                </p>
            )
        },
        {
            title: 'Длительность звонка',
            dataIndex: 'call_duration',
            key: 'call_duration',
            // sorter: true,
            render: (text: string, record: Call) => {
                return <span className={styles.tableText}>{text}</span>;
            }
        },
        {
            title: 'Телефон клиента',
            dataIndex: 'phone_number',
            key: 'phone_number',
            render: (text: string, record: Call) => {
                return <span className={styles.tableText}>{text}</span>;
            }
        },
        {
            title: 'Имя клиента',
            dataIndex: 'subject_name',
            key: 'subject_name',
            // sorter: true,
            render: (text: string, record: Call) => {
                return <span className={styles.tableText}>{text || 'Не указано'}</span>;
            }
        },
    ];

    const onRowClick = (id : number | string | null) => {
        setCurrentCallId(id);
        navigate(`/call/${id}`);

    }

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
                        onChange={handlePageSizeChange}
                        options={[
                            { value: '10', label: '10' },
                            { value: '20', label: '20' },
                            { value: '30', label: '30' },
                        ]}
                    />
                </Flex>
                <Text>
                    <Text strong>Найдено:</Text> {callsByCategory?.paginator?.totalCount || 0}
                </Text>
            </Flex>

            <Flex align="center" gap="middle" className={styles.CustomPagination}>
                <Pagination
                    current={callsByCategory?.paginator?.currentPage || currentPage}
                    pageSize={callsByCategory?.paginator?.perPage || pageSize}
                    total={callsByCategory?.paginator?.totalCount || 0}
                    onChange={handlePageChange}
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
            <Table<Call>
                columns={columns}
                dataSource={data}
                className={styles.CallsTable}
                pagination={false}
                loading={loading}
                footer={customFooter}
                rowKey="id"
                locale={{
                    emptyText: (
                        <div style={{ padding: '40px 0' }}>
                            <div style={{
                                fontSize: '16px',
                                color: '#8C8C8C',
                                marginBottom: '8px'
                            }}>
                                Нет данных
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: '#BFBFBF'
                            }}>
                                По вашему запросу ничего не найдено
                            </div>
                        </div>
                    )
                }}
                onRow={(record: Call) => ({
                    onClick: () => {
                        onRowClick(record.id);
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