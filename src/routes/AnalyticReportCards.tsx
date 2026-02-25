import React from 'react';
import PageContainer from "../components/ui/PageContainer/PageContainer";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import {Flex} from "antd";
import AnalyticReportCard from "../components/AnalyticReportCards/AnalyticReportCard";
import styles from '../components/AnalyticReportCards/AnalyticReportCards.module.scss'

const AnalyticReportCards = () => {

    const reportCards = [
        {
            title:'Назначение встречи',
            description:'Анализ распределения   назначенных\n' +
                '  ДСК в зависимости от типа контакта (встреча \n' +
                '  или звонок/мессенджер)',
            essense:'Помогает определить преобладающий \n' +
                '  формат взаимодействия при назначении \n' +
                '  следующего контакта',
            link:'/make-an-appointment'

        }
    ]
    return (
        <PageContainer style={{marginRight:'20px'}}>
            <Flex vertical gap={20}>
                <PageTitle text='Отчеты'/>
            </Flex>
            <Flex gap={20} className={styles.AnalyticReportCardList}>
                {reportCards.map(reportCard => (<AnalyticReportCard item={reportCard} />))}
            </Flex>
        </PageContainer>
    );
};

export default AnalyticReportCards;