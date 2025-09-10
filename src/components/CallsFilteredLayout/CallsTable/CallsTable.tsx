import React from 'react';
import {Flex, Table} from "antd";
import {data, formatDate} from "./utils";

export interface TableRecord {
    key: string;
    id: string;
    callType: string;
    date: string;
    duration:string;
    phone: string;
    userName: string;
    checklists: string[];
    markers: string[];
}
const CallsTable = () => {

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Тип звонка',
            dataIndex: 'callType',
            key: 'callType',
            sorter: true,
        },
        {
            title: 'Дата звонка',
            dataIndex: 'date',
            key: 'date',
            render: (text: string, record: TableRecord) => (
                <span>
                {formatDate(record.date)}
            </span>
            )
        },
        {
            title: 'Длительность звонка',
            dataIndex: 'duration',
            key: 'duration',
            sorter: true,
        },
        {
            title: 'Телефон клиента',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Имя клиента',
            dataIndex: 'userName',
            key: 'userName',
            sorter: true,
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

    return (
        <Table columns={columns}
               dataSource={data}
        />
)
    ;
};

export default CallsTable;