import React from 'react';
import { Flex, Tooltip } from "antd";
import styles from './AnalyticsLayout2.module.scss';

// Определяем интерфейс для данных пользователя
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

// Определяем интерфейс для пропсов компонента
interface EmployeeLineChartsProps {
    userData: UserData;
}

const EmployeeLineCharts: React.FC<EmployeeLineChartsProps> = ({ userData }) => {
    // Проверяем, что все значения корректны
    const total_calls = userData.total_calls || 0;

    // Данные для первого графика
    const next_contact_assigned = userData.next_contact_assigned || 0;
    const percentage_of_appointments_made = userData.percentage_of_appointments_made || 0;

    // Данные для второго графика
    const meeting = userData.meeting || 0;
    const call_or_messenger = userData.call_or_messenger || 0;
    const not_defined = userData.not_defined || 0;

    // Вычисляем проценты для первого графика
    const nextContactWidth = total_calls > 0 ? (next_contact_assigned / total_calls) * 100 : 0;
    const notAppointedWidth = total_calls > 0 ? (percentage_of_appointments_made / total_calls) * 100 : 0;

    // Вычисляем проценты для второго графика
    const meetingWidth = total_calls > 0 ? (meeting / total_calls) * 100 : 0;
    const callWidth = total_calls > 0 ? (call_or_messenger / total_calls) * 100 : 0;
    const notDefinedWidth = total_calls > 0 ? (not_defined / total_calls) * 100 : 0;

    return (
        <Flex vertical className={styles.EmployeeLineCharts} style={{ width: 'calc((100% - 20px) / 2) ', gap: '24px' }}>

            <Flex justify="space-between" align="center">
                <h3 style={{ margin: 0 }}>{userData.name}</h3>
                <div style={{ fontSize: '14px', color: '#666' }}>
                    Всего за период: <strong>{total_calls}</strong>
                </div>
            </Flex>

            <div style={{ width: '100%' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>
                    Встречи
                </h4>
                <div style={{
                    width: '100%',
                    height: '30px',
                    display: 'flex',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: '#f0f0f0'
                }}>
                    {/* Встреча назначена */}
                    {next_contact_assigned > 0 && (
                        <Tooltip title={`Встреча назначена: ${next_contact_assigned}`}>
                            <div style={{
                                width: `${nextContactWidth}%`,
                                height: '100%',
                                backgroundColor: '#4CAF50',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }} />
                        </Tooltip>
                    )}

                    {percentage_of_appointments_made > 0 && (
                        <Tooltip title={`Встреча не назначена: ${percentage_of_appointments_made}`}>
                            <div style={{
                                width: `${notAppointedWidth}%`,
                                height: '100%',
                                backgroundColor: '#F44336',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }} />
                        </Tooltip>
                    )}
                </div>

                {/* Легенда для первого графика */}
                <Flex style={{ marginTop: '8px', gap: '16px', fontSize: '12px' }}>
                    <Flex align="center" gap={4}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#4CAF50', borderRadius: '2px' }} />
                        <span>Встреча назначена: {next_contact_assigned}</span>
                    </Flex>
                    <Flex align="center" gap={4}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#F44336', borderRadius: '2px' }} />
                        <span>Встреча не назначена: {percentage_of_appointments_made}</span>
                    </Flex>
                </Flex>
            </div>

            <div style={{ width: '100%' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>
                    Разделение по направлениям
                </h4>
                <div style={{
                    width: '100%',
                    height: '30px',
                    display: 'flex',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: '#f0f0f0'
                }}>

                    {meeting > 0 && (
                        <Tooltip title={`Встреча: ${meeting}`}>
                            <div style={{
                                width: `${meetingWidth}%`,
                                height: '100%',
                                backgroundColor: '#2196F3',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }} />
                        </Tooltip>
                    )}

                    {call_or_messenger > 0 && (
                        <Tooltip title={`Звонок/Мессенджер: ${call_or_messenger}`}>
                            <div style={{
                                width: `${callWidth}%`,
                                height: '100%',
                                backgroundColor: '#FF9800',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }} />
                        </Tooltip>
                    )}

                    {not_defined > 0 && (
                        <Tooltip title={`Не определено: ${not_defined}`}>
                            <div style={{
                                width: `${notDefinedWidth}%`,
                                height: '100%',
                                backgroundColor: '#9C27B0',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }} />
                        </Tooltip>
                    )}
                </div>

                {/* Легенда для второго графика */}
                <Flex style={{ marginTop: '8px', gap: '16px', fontSize: '12px', flexWrap: 'wrap' }}>
                    <Flex align="center" gap={4}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#2196F3', borderRadius: '2px' }} />
                        <span>Встреча: {meeting}</span>
                    </Flex>
                    <Flex align="center" gap={4}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#FF9800', borderRadius: '2px' }} />
                        <span>Звонок/Мессенджер: {call_or_messenger}</span>
                    </Flex>
                    <Flex align="center" gap={4}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#9C27B0', borderRadius: '2px' }} />
                        <span>Не определено: {not_defined}</span>
                    </Flex>
                </Flex>
            </div>

            <Flex style={{
                marginTop: '8px',
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                gap: '16px',
                flexWrap: 'wrap',
                fontSize: '12px'
            }}>
                <div>
                    <span style={{ color: '#666' }}>Качество: </span>
                    <strong>{(userData.quality * 100).toFixed(1)}%</strong>
                </div>
                <div>
                    <span style={{ color: '#666' }}>KPI: </span>
                    <strong>{(userData.kpi * 100).toFixed(1)}%</strong>
                </div>
                <div>
                    <span style={{ color: '#666' }}>Доля звонков: </span>
                    <strong>{(userData.call_share * 100).toFixed(1)}%</strong>
                </div>
            </Flex>
        </Flex>
    );
};

export default EmployeeLineCharts;