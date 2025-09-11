import React, { useState, useMemo } from 'react';
import { ConfigProvider, Flex, Pagination, Select, Table, Typography } from "antd";
import { data, formatDate } from "./utils";
import styles from '../CallsFilteredLayout.module.scss';
import CustomSelect from "../../ui/CustomSelect/CustomSelect";

const { Text } = Typography;
const { Option } = Select;

export interface TableRecord {
    key: string;
    id: string;
    callType: string;
    date: string;
    duration: string;
    phone: string;
    userName: string;
    checklists: string[];
    markers: string[];
}

const CallsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    }, [currentPage, pageSize, data]);

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
            width: 150,
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
            render: (checklists: string[]) => (
                <span>
                    {checklists.length === 1 ? checklists[0] : `${checklists.length}`}
                </span>
            )
        },
        {
            title: 'Маркеры',
            dataIndex: 'markers',
            key: 'markers',
            render: (markers: string[]) => (
                <span>
                    {markers.length === 1 ? markers[0] : `${markers.length}`}
                </span>
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
                    <Select
                        defaultValue={pageSize}
                        onChange={(value) => {
                            setPageSize(Number(value));
                            setCurrentPage(1);
                        }}
                        style={{ width: 80 }}
                        size="small"
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
            />
        </ConfigProvider>
    );
};

export default CallsTable;
