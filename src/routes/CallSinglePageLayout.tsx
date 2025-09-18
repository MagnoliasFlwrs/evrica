import React from 'react';
import PageContainer from "../components/ui/PageContainer/PageContainer";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import {Breadcrumb, Flex} from "antd";
import BreadcrumbIcon from "../components/icons/BreadcrumbIcon";
import styles from '../components/CallSinglePageLayout/CallSinglePageLayout.module.scss'
import BlueButton from "../components/ui/BlueButton/BlueButton";
import DownloadIcon from "../components/icons/DownloadIcon";
import CallSinglePageWidgets from "../components/CallSinglePageLayout/CallSinglePageWidgets";
import CallDetails from "../components/CallSinglePageLayout/CallDetails";
import CallTranscribationWidgets from "../components/CallSinglePageLayout/CallTranscribationWidgets";
import AudioPlayerBlock from "../components/CallSinglePageLayout/AudioPlayerBlock";

const CallSinglePageLayout = () => {
    return (
        <PageContainer>
            <Breadcrumb
                separator={<BreadcrumbIcon/>}
                items={[
                    {
                        title: 'Звонки',
                        href: '/calls/filtered',
                    },
                    {
                        title: 'Информация о разговоре',
                    },
                ]}
            />
            <Flex className={styles.CallSinglePageLayoutHead}>
                <PageTitle text='Информация о разговоре'/>
                <BlueButton text='Скачать отчет' icon={<DownloadIcon/>}/>
            </Flex>
            <CallSinglePageWidgets/>
            <AudioPlayerBlock/>
            <CallDetails/>
            <CallTranscribationWidgets/>

        </PageContainer>
    );
};

export default CallSinglePageLayout;