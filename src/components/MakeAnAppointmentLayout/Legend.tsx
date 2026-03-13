import React from 'react';
import {Flex} from "antd";
import styles from './AnalyticsLayout2.module.scss'

const Legend = () => {
    return (
        <Flex className={styles.Legend}>
            <p>
                <span>Легенда:</span><br/><br/>

                <span>Целевая коммуникация</span> - разговор связан с запросом или темами консультации, где логично назначить следующий шаг<br/><br/>

                <span>Доля звонков</span> = общее количество звонков / количество звонков менеджера<br/><br/>
                <span>Качество</span> = (количество назначенных встреч / на количество консультаций менеджера) * 100<br/><br/>
                <span>KPI</span> =  (% доли звонков * 0,3) + % качества
            </p>
        </Flex>
    );
};

export default Legend;