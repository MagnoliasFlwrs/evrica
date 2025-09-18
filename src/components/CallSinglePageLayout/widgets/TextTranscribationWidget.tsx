import React from 'react';
import styles from '../CallSinglePageLayout.module.scss';
import { Flex, Input } from "antd";
import CopyIcon from "../../icons/CopyIcon";
import DownloadIcon from "../../icons/DownloadIcon";
import HideSpeechStagesIcon from "../../icons/hideSpeechStagesIcon";
import SearchIcon from "../../ui/CustomSelect/icons/SearchIcon";
import TranscribationCustomerItem from "../TranscribationItems/TranscribationCustomerItem";
import TranscribationOperatorItem from "../TranscribationItems/TranscribationOperatorItem";
import BlueCircledIcon from "../../ui/BlueCircledIcon/BlueCircledIcon";

interface TranscribationItem {
    type: 'operator' | 'customer';
    time: string;
    text: string;
}

interface TextTranscribationWidgetProps {
    // data?: TranscribationItem[];
}

const TextTranscribationWidget: React.FC<TextTranscribationWidgetProps> = () => {

    const transcribationData: TranscribationItem[] = [
        {
            type: 'operator',
            time: '11:45',
            text: 'Здравствуйте, вы обратились в интернет-магазин AUTO. Чем могу помочь?',
        },
        {
            type: 'customer',
            time: '11:45',
            text: 'Добрый день. Меня интересует товар с артикулом 126389789',
        },
        {
            type: 'operator',
            time: '11:45',
            text: 'Давайте проверим. Минутку, пожалуйста. (пауза) К сожалению, у нас в наличии нет шин именно с такими размерами. Но у нас есть альтернативные варианты, которые могут подойти для вашего автомобиля. Могу посоветовать вам пару других размеров или поискать информацию о наличии нужного размера у наших партнеров.',
        },
        {
            type: 'operator',
            time: '11:46',
            text: 'Маленькая кухня для дачи, интересуется дизайном',
        },
        {
            type: 'customer',
            time: '11:46',
            text: 'Неизвестные точные размеры кухни на даче',
        },
    ];

    return (
        <Flex className={styles.TextTranscribationWidget}>
            <Flex className={styles.TextTranscribationWidgetHead}>
                <p>Текстовая расшифровка разговора</p>
                <Flex className={styles.TextTranscribationWidgetHeadButtons}>
                    <button className={styles.copyBtn}>
                        <CopyIcon />
                    </button>
                    <BlueCircledIcon icon={<DownloadIcon />}/>
                </Flex>
            </Flex>
            <Flex className={styles.SearchRow}>
                <button>
                    <HideSpeechStagesIcon />
                    Скрыть этапы разговора
                </button>
                <Input
                    prefix={<SearchIcon />}
                    placeholder='Поиск по расшифровке'
                    className={styles.SearchRowInput}
                />
            </Flex>
            <Flex className={styles.transcribation}>
                {transcribationData.length > 0 &&
                    transcribationData.map((item, index) => {
                        switch (item.type) {
                            case 'operator':
                                return <TranscribationOperatorItem key={index} item={item} />;
                            case 'customer':
                                return <TranscribationCustomerItem key={index} item={item} />;
                            default:
                                return null;
                        }
                    })
                }
            </Flex>
        </Flex>
    );
};

export default TextTranscribationWidget;