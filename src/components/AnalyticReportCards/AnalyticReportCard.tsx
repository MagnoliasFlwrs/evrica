import React from 'react';
import { Flex} from "antd";
import styles from './AnalyticReportCards.module.scss'
import description from './description.png';
import edit from './edit.png'
import hands from './hands.png'


interface AnalyticReportCardProps {
    item:{
        title:string,
        description:string,
        essense:string,
        link:string,
    }
}

const AnalyticReportCard = ({item}:AnalyticReportCardProps) => {
    return (
        <Flex  className={styles.AnalyticReportCard}>
            <Flex gap={20} align='center'>
                <Flex className={styles.AnalyticReportCardAvatar}>
                    <img src={hands} alt="avatar"/>
                </Flex>
                <p className={styles.AnalyticReportCardTitle}>{item.title}</p>
            </Flex>

            <Flex className={styles.AnalyticReportCardText}>
                <img src={description} alt="icon" width={30}/>
                <p><span>Описание:</span> {item.description}</p>
            </Flex>
            <div className={styles.AnalyticReportCardDivider}></div>
            <Flex className={styles.AnalyticReportCardText}>
                <img src={edit} alt="icon" width={30}/>
                <p><span>Суть:</span> {item.essense}</p>
            </Flex>
            <a className={styles.AnalyticReportCardLink} href={item.link}>Сформировать</a>
        </Flex>
    );
};

export default AnalyticReportCard;