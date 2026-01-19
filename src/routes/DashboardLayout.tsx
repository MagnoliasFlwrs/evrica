import React, {useEffect} from 'react';
import PageContainer from "../components/ui/PageContainer/PageContainer";
import styles from '../components/DashboardLayout/DashboardLayout.module.scss'
import {Flex, Modal, Spin} from "antd";
import {useAuth} from "../store";
import Profile from "../icons/Profile";
import LogoutIcon from "../components/icons/LogoutIcon";
import CallsChart from "../components/DashboardLayout/CustomChart";
import {useDashboardStore} from "../stores/dashboardStore";
import CustomChart from "../components/DashboardLayout/CustomChart";
import ProblemCallsChart from "../components/DashboardLayout/ProblemCallsChart";
import DealProbabilityChart from "../components/DashboardLayout/DealProbabilityChart";
import EmployeeDidntHandleObjectionChart from "../components/DashboardLayout/EmployeeDidntHandleObjectionChart";

const DashboardLayout = () => {
    const user = useAuth((state)=> state.user);
    const logout = useAuth((state)=> state.logout);
    const getRiskOfLosingAClient = useDashboardStore((state) => state.getRiskOfLosingAClient);
    const loading = useDashboardStore((state) => state.loading);
    const getWhoIsControlOfTheConversation = useDashboardStore((state) => state.getWhoIsControlOfTheConversation);
    const getCallsQualityLastDays = useDashboardStore((state) => state.getCallsQualityLastDays);
    const getEmployeeDidntHandleObjection = useDashboardStore((state) => state.getEmployeeDidntHandleObjection);
    const getDealProbabilityLastDays = useDashboardStore((state) => state.getDealProbabilityLastDays);
    const getProblemCallsPriorityLastDays = useDashboardStore((state) => state.getProblemCallsPriorityLastDays);
    const riskOfLosingAClient = useDashboardStore((state)=> state.riskOfLosingAClient);
    const whoIsControlOfTheConversation = useDashboardStore((state)=> state.whoIsControlOfTheConversation);
    const callsQuality = useDashboardStore((state)=> state.callsQuality);
    const employeeDidntHandleObjection = useDashboardStore((state)=> state.employeeDidntHandleObjection);
    const dealProbabilityLastDays = useDashboardStore((state)=> state.dealProbabilityLastDays);
    const problemCallsPriorityLastDays = useDashboardStore((state)=> state.problemCallsPriorityLastDays);
    const [modal, contextHolder] = Modal.useModal();


    const handleLogout = () => {

    }
    useEffect(() => {
        if(user) {
            getRiskOfLosingAClient(user?.organization_id,7);
            getWhoIsControlOfTheConversation(user?.organization_id,7);
            getCallsQualityLastDays(user?.organization_id,7);
            getEmployeeDidntHandleObjection(user?.organization_id,7);
            getDealProbabilityLastDays(user?.organization_id,7);
            getProblemCallsPriorityLastDays(user?.organization_id,7);
        }

    }, [user])



    const showConfirm = () => {
        modal.confirm({
            title: 'Вы собираетесь выйти из аккаунта',
            okText: 'Выйти',
            cancelText: 'Отмена',
            onOk() {
                logout()
            },
        });
    };

    return (
        <PageContainer>
            <Flex className={styles.dashboardHead}>
                <p>Привет, {user?.login || 'Пользователь'}</p>
                <Flex className={styles.dashboardButtons}>
                    <a href="#" className={styles.dashboardButton}>
                        <Profile/>
                    </a>
                    <span className={styles.dashboardButton} onClick={showConfirm}>
                        <LogoutIcon/>
                    </span>
                </Flex>

            </Flex>
            {
                loading ?
                    <Spin/>
                    :
                    <Flex className={styles.dashboardCards}>
                        <Flex className={styles.chartCard} >
                            <CustomChart chartDataArr={riskOfLosingAClient} title='Риск потери клиента' labels={['Все звонки' , 'Звонки']}/>
                        </Flex>
                        <Flex className={`${styles.chartCard} ${styles.chartCardMax}`} >
                            <EmployeeDidntHandleObjectionChart chartDataArr={employeeDidntHandleObjection} title='Сотрудник не отработал возражение' labels={['Все' +
                            ' звонки' , 'Высокое качество', 'Среднее качество' , 'Низкое качество']}/>
                        </Flex>
                        <Flex className={`${styles.chartCard} ${styles.chartCardMax}`} >
                            <DealProbabilityChart chartDataArr={dealProbabilityLastDays} title='Вероятность заключения сделки' labels={['Все' +
                            ' звонки' , 'Высокая вероятность' , 'Средняя вероятность', 'Низкая вероятность']}/>
                        </Flex>
                        <Flex className={styles.chartCard} >
                            <CustomChart chartDataArr={whoIsControlOfTheConversation} title='Кто управляет беседой' labels={['Все' +
                            ' звонки' , 'Звонки']}/>
                        </Flex>
                        <Flex className={styles.chartCard} >
                            <CustomChart chartDataArr={callsQuality} title='Качество проработки звонка' labels={['Все' +
                            ' звонки' , 'Звонки']}/>
                        </Flex>
                        <Flex className={`${styles.chartCard} ${styles.chartCardMax}`} >
                            <ProblemCallsChart chartDataArr={problemCallsPriorityLastDays} title='Проблемный звонок' labels={['Все звонки' , 'Высокий приоритет',  'Средний приоритет', 'Низкий приоритет']}/>
                        </Flex>
                    </Flex>

            }

            {contextHolder}
        </PageContainer>
    );
};

export default DashboardLayout;