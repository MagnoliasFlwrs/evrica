import React from 'react';
import {Avatar, Flex, Progress, Steps} from "antd";
import styles from "./AnalyticsLayout2.module.scss";

import {getGenderIcon} from "./helper";

interface UserData {
    name: string;
    total_calls: number;
    next_contact_assigned: number;
    not_next_contact_assigned: number;
    percentage_of_appointments_made: number;
    meeting: number;
    call_or_messenger: number;
    not_defined: number;
    call_share: number;
    quality: number;
    kpi: number;
}

interface EmployeeLineChartsProps {
    userData: UserData;
}

const ManagerCard = ({userData}:EmployeeLineChartsProps) => {
    const next_contact_assigned = userData.next_contact_assigned || 0;
    const not_next_contact_assigned = userData.not_next_contact_assigned || 0;
    const total_calls = userData.total_calls || 0;
    const other_contacts = total_calls - next_contact_assigned -  not_next_contact_assigned;

    const meeting = userData.meeting || 0;
    const call_or_messenger = userData.call_or_messenger || 0;
    const not_defined = userData.not_defined || 0;
    const call_share_percent = Number((userData.call_share * 100).toFixed(1)) || 0;

    const userName = userData.name;

    const userIcon = getGenderIcon(userName);

    const baseItems = [
        {
            title: `Встреч: ${meeting}`,
            status: 'finish' as const,
        },
        {
            title: `Звонок/мессенджер: ${call_or_messenger}`,
            status: 'finish' as const,
        },
        {
            title: `Не определено: ${not_defined}`,
            status: 'finish' as const,
        },
    ];

    const items = other_contacts > 0
        ? [
            ...baseItems,
            {
                title: `Иное: ${other_contacts}`,
                status: 'finish' as const,
            }
        ]
        : baseItems;

    return (
        <Flex className={styles.managerCard} vertical gap={20}>
            <Flex className={styles.userName}>
                <span>{userName}</span>
            </Flex>

            <Flex className={styles.userGeneralInfo} gap={20}>
                <Avatar size={90} src={userIcon} alt={`${userName} avatar`} />
                <ul>
                    <li>Всего за период: <span>{total_calls}</span></li>
                    <li>Доля звонков: <span>{(userData.call_share * 100).toFixed(1)}%</span></li>
                    <li>Качество: <span>{(userData.quality * 100).toFixed(1)}%</span></li>
                    <li>KPI: <span>{(userData.kpi * 100).toFixed(1)}%</span></li>

                </ul>
                <Flex className={styles.progress}>
                    <Progress type="circle" percent={call_share_percent} size={70} />
                </Flex>
            </Flex>
            <Flex className={styles.userOtherInfo} vertical gap={30}>
                <p>Итоги договоренностей: </p>
                <Steps
                    direction="vertical"
                    current={items.length}
                    items={items}
                />
            </Flex>
        </Flex>
    );
};

export default ManagerCard;