import React from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import {Flex} from "antd";

interface Word {
    word: string;
    endTime: string;
    startTime: string;
    confidence: number;
}

interface Props {
    item: {
        type: 'operator' | 'customer';
        time: string;
        text: string;
        words: Word[];
    };
}

const TranscribationCustomerItem: React.FC<Props> = ({item}) => {
    const createMarkup = (html: string) => {
        return { __html: html };
    };

    return (
        <Flex className={styles.TranscribationCustomerItem}>
            <Flex className={styles.dateRow}>
                <span>{item?.time}</span>
                <span>Клиент</span>
            </Flex>
            <Flex className={styles.textRow}>
                {item.words.map((wordObj, index) => (
                    <span
                        key={index}
                        className={styles.word}
                        data-start-time={wordObj.startTime}
                        data-end-time={wordObj.endTime}
                        data-confidence={wordObj.confidence}
                        dangerouslySetInnerHTML={createMarkup(
                            wordObj.word + (index < item.words.length - 1 ? ' ' : '')
                        )}
                    />
                ))}
            </Flex>
        </Flex>
    );
};

export default TranscribationCustomerItem;