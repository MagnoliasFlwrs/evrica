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
    console.log(callsByCategory);

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
            sorter: true,
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
            sorter: true,
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
            sorter: true,
            render: (text: string, record: Call) => {
                return <span className={styles.tableText}>{text || 'Не указано'}</span>;
            }
        },
        // {
        //     title: 'Чек-листы',
        //     dataIndex: 'checklists',
        //     key: 'checklists',
        //     render: (checklists: string[], record: Call, index: number) => (
        //         checklists.length === 1 ? (
        //             <span className={styles.checklistItem}>{checklists[0]}</span>
        //         ) : (
        //             <Flex
        //                 className={styles.manyItemsContainer}
        //                 onClick={(e) => {
        //                     e.stopPropagation();
        //                     setVisibleChecklistIndex(visibleChecklistIndex === index ? null : index);
        //                     setVisibleMarkerslistIndex(null);
        //                 }}
        //                 style={{ cursor: 'pointer', position: 'relative' }}
        //             >
        //                 <span className={styles.checklistItemLength}>{`${checklists.length}`}</span>
        //                 {visibleChecklistIndex === index && (
        //                     <Flex className={styles.manyItemsContainerModal}>
        //                         {checklists.map((item, i) => (
        //                             <span className={styles.checklistItem} key={i}>{item}</span>
        //                         ))}
        //                     </Flex>
        //                 )}
        //             </Flex>
        //         )
        //     )
        // },
        // {
        //     title: 'Маркеры',
        //     dataIndex: 'markers',
        //     key: 'markers',
        //     render: (markers: Array<{ value: string; label: string }>, record: Call, index: number) => (
        //         markers.length === 1 ? (
        //             <Tag className={`${styles.tag} ${styles[markers[0].value]}`}>
        //                 {markers[0].label}
        //             </Tag>
        //         ) : (
        //             <Flex
        //                 className={styles.manyItemsContainer}
        //                 onClick={(e) => {
        //                     e.stopPropagation();
        //                     setVisibleMarkerslistIndex(visibleMarkerslistIndex === index ? null : index);
        //                     setVisibleChecklistIndex(null);
        //                 }}
        //                 style={{ cursor: 'pointer', position: 'relative' }}
        //             >
        //                 <span className={styles.markerItemLength}>{`${markers.length}`}</span>
        //                 {visibleMarkerslistIndex === index && (
        //                     <Flex className={styles.manyItemsContainerModal}>
        //                         {markers.map((marker, i) => (
        //                             <Tag
        //                                 className={`${styles.tag} ${styles[marker.value]}`}
        //                                 key={marker.value}
        //                             >
        //                                 {marker.label}
        //                             </Tag>
        //                         ))}
        //                     </Flex>
        //                 )}
        //             </Flex>
        //         )
        //     )
        // }
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
                    <Text strong>Найдено:</Text> {callsByCategory?.paginator?.totalCount || 0}
                </Text>
            </Flex>

            <Flex align="center" gap="middle" className={styles.CustomPagination}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={callsByCategory?.paginator?.totalCount || 0}
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
            <Table<Call>
                columns={columns}
                dataSource={data}
                className={styles.CallsTable}
                pagination={false}
                footer={customFooter}
                rowKey="id"
                onRow={(record: Call) => ({
                    onClick: () => {
                        navigate(`/call/${record.id}`);
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