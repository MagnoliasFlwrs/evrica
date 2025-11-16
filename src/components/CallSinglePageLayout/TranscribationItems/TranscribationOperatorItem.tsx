import React from 'react';
import {Flex} from "antd";
import styles from '../CallSinglePageLayout.module.scss'

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

const TranscribationOperatorItem: React.FC<Props> = ({item}) => {
    const createMarkup = (html: string) => {
        return { __html: html };
    };

    return (
        <Flex className={styles.TranscribationOperatorItem}>
            <Flex className={styles.dateRow}>
                <span>{item?.time}</span>
                <span>Оператор</span>
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

export default TranscribationOperatorItem;