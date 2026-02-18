import React from 'react';
import {Avatar, Flex, Progress, Steps} from "antd";
import styles from "./AnalyticsLayout2.module.scss";

import {getGenderIcon} from "./helper";
import Profile from "../../icons/Profile";

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
            title: `Встреча: ${meeting}`,
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
            <Flex className={styles.progress}>
                <Progress type="circle" percent={call_share_percent} size={80} />
            </Flex>
            <Flex className={styles.userGeneralInfo} gap={50}>
                <Avatar size={100} src={userIcon} alt={`${userName} avatar`} />
                <ul>
                    <li>Встреча назначена: <span>{next_contact_assigned}</span></li>
                    <li>Встреча не назначена: <span>{not_next_contact_assigned}</span></li>
                </ul>
            </Flex>
            <Flex className={styles.userOtherInfo} vertical gap={30}>
                <p>{call_share_percent} %</p>
                <Steps
                    orientation="vertical"
                    current={items.length}
                    items={items}
                />
            </Flex>
        </Flex>
    );
};

export default ManagerCard;