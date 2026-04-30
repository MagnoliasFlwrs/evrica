import React, { useEffect } from 'react';
import PageContainer from '../components/ui/PageContainer/PageContainer';
import PageTitle from '../components/ui/PageTitle/PageTitle';
import { Breadcrumb, Flex } from 'antd';
import BreadcrumbIcon from '../components/icons/BreadcrumbIcon';
import styles from '../components/CallSinglePageLayout/CallSinglePageLayout.module.scss';
import BlueButton from '../components/ui/BlueButton/BlueButton';
import DownloadIcon from '../components/icons/DownloadIcon';
import CallSinglePageWidgets from '../components/CallSinglePageLayout/CallSinglePageWidgets';
import CallDetails from '../components/CallSinglePageLayout/CallDetails';
import CallTranscribationWidgets from '../components/CallSinglePageLayout/CallTranscribationWidgets';
import AudioPlayerBlock from '../components/CallSinglePageLayout/AudioPlayerBlock';
import { useCallsStore } from '../stores/callsStore';
import { useAuth } from '../store';
import { useParams } from 'react-router-dom';

const CallSinglePageLayout = () => {
  const getCurrentCallInfo = useCallsStore((state) => state.getCurrentCallInfo);
  const { id: currentCallId } = useParams();
  const user = useAuth((state) => state.user);
  const getPromptList = useCallsStore((state) => state.getPromptList);
  const getAiJsonList = useCallsStore((state) => state.getAiJsonList);
  const currentCallInfo = useCallsStore((state) => state.currentCallInfo);

  useEffect(() => {
    getCurrentCallInfo(currentCallId || '');
  }, [currentCallId, getCurrentCallInfo]);

  useEffect(() => {
    getPromptList(user?.organization_id);
    getAiJsonList(user?.organization_id, currentCallInfo?.id);
  }, [currentCallInfo, getAiJsonList, getPromptList, user?.organization_id]);

  return (
    <PageContainer>
      <Breadcrumb
        separator={<BreadcrumbIcon />}
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
        <PageTitle text="Информация о разговоре" />
        <BlueButton text="Скачать отчет" icon={<DownloadIcon />} />
      </Flex>
      <CallSinglePageWidgets />
      <AudioPlayerBlock />
      <CallDetails />
      <CallTranscribationWidgets />
    </PageContainer>
  );
};

export default CallSinglePageLayout;
