import React, {useEffect, useState, useMemo} from 'react';
import styles from '../CallSinglePageLayout.module.scss';
import { Flex, Input } from "antd";
import CopyIcon from "../../icons/CopyIcon";
import DownloadIcon from "../../icons/DownloadIcon";
import HideSpeechStagesIcon from "../../icons/hideSpeechStagesIcon";
import SearchIcon from "../../ui/CustomSelect/icons/SearchIcon";
import TranscribationCustomerItem from "../TranscribationItems/TranscribationCustomerItem";
import TranscribationOperatorItem from "../TranscribationItems/TranscribationOperatorItem";
import BlueCircledIcon from "../../ui/BlueCircledIcon/BlueCircledIcon";
import CustomTextModal from "../../ui/CustomTextModal/CustomTextModal";
import {useCallsStore} from "../../../stores/callsStore";
import {
    copyTranscribationToClipboard,
    generateTranscribationTXT,
    getTimeFromChunk
} from "../utils";
import {TextTranscribationWidgetProps, TranscribationChunk, TranscribationItem, Word} from "../types";

const TextTranscribationWidget: React.FC<TextTranscribationWidgetProps> = () => {
    const [downloadModal, setDownloadModal] = useState(false);
    const [copyModal, setCopyModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const currentCallInfo = useCallsStore((state) => state.currentCallInfo);
    const currentCallId = useCallsStore((state) => state.currentCallId);

    const [transcribationData, setTranscribationData] = useState<TranscribationItem[]>([]);
    const [originalTranscribationData, setOriginalTranscribationData] = useState<TranscribationItem[]>([]);



    useEffect(() => {
        if (currentCallInfo?.json?.response?.chunks) {
            const chunks: TranscribationChunk[] = currentCallInfo.json.response.chunks;

            const formattedData: TranscribationItem[] = chunks.map(chunk => {
                const type = chunk.channelTag === '1' ? 'operator' : 'customer' as 'operator' | 'customer';
                const time = getTimeFromChunk(chunk);
                const text = chunk.alternatives[0]?.text || '';
                const words = chunk.alternatives[0]?.words || [];

                return {
                    type,
                    time,
                    text,
                    words
                };
            });

            setTranscribationData(formattedData);
        }
    }, [currentCallInfo]);

    const highlightWords = (words: Word[], query: string): Word[] => {
        if (!query || query.length < 2) return words;

        const lowerQuery = query.toLowerCase();
        return words.map(word => ({
            ...word,
            word: word.word.toLowerCase().includes(lowerQuery)
                ? `<mark>${word.word}</mark>`
                : word.word
        }));
    };

    const filteredTranscribationData = useMemo(() => {
        if (!searchQuery || searchQuery.length < 2) {
            return transcribationData;
        }

        const lowerQuery = searchQuery.toLowerCase();

        return transcribationData
            .map(item => {
                const containsQuery = item.text.toLowerCase().includes(lowerQuery);
                if (containsQuery) {
                    const highlightedWords = item.words.map(word => ({
                        ...word,
                        word: word.word.toLowerCase().includes(lowerQuery)
                            ? `<mark class="${styles.highlighted}">${word.word}</mark>`
                            : word.word
                    }));

                    return {
                        ...item,
                        words: highlightedWords
                    };
                }

                return item;
            })
            .filter(item => item.text.toLowerCase().includes(lowerQuery));
    }, [transcribationData, searchQuery]);

    useEffect(() => {
        if (currentCallInfo?.json?.response?.chunks) {
            const chunks: TranscribationChunk[] = currentCallInfo.json.response.chunks;

            const formattedData: TranscribationItem[] = chunks.map(chunk => {
                const type = chunk.channelTag === '1' ? 'operator' : 'customer' as 'operator' | 'customer';
                const time = getTimeFromChunk(chunk);
                const text = chunk.alternatives[0]?.text || '';
                const words = chunk.alternatives[0]?.words || [];

                return {
                    type,
                    time,
                    text,
                    words
                };
            });

            setTranscribationData(formattedData);
            setOriginalTranscribationData(formattedData);
        }
    }, [currentCallInfo]);

    const handleDownload = () => {
        if (originalTranscribationData.length > 0) {
            generateTranscribationTXT(originalTranscribationData, currentCallId);
        }
        setDownloadModal(false);
    }

    const handleCopy = async () => {
        try {
            await copyTranscribationToClipboard(originalTranscribationData);
            console.log('Текст скопирован в буфер обмена');
        } catch (err) {
            console.error('Ошибка копирования: ', err);
        }
        setCopyModal(false);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    return (
        <Flex className={styles.TextTranscribationWidget}>
            <Flex className={styles.TextTranscribationWidgetHead}>
                <p>Текстовая расшифровка разговора</p>
                <Flex className={styles.TextTranscribationWidgetHeadButtons}>
                    <Flex className={styles.copyBtnContainer}>
                        <button className={styles.copyBtn} onClick={() => setCopyModal(true)}>
                            <CopyIcon/>
                        </button>
                        {
                            copyModal &&
                            <CustomTextModal
                                text='Скопировать'
                                onClick={() => handleCopy()}
                                width={96}
                                top={true}
                                left={true}
                            />
                        }
                    </Flex>

                    <Flex className={styles.downloadBtnContainer}>
                        <BlueCircledIcon icon={<DownloadIcon />}
                                         onClick={() => handleDownload()}
                                         />
                    </Flex>
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
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </Flex>
            <Flex className={styles.transcribation}>
                {filteredTranscribationData.length > 0 ? (
                    filteredTranscribationData.map((item, index) => {
                        switch (item.type) {
                            case 'operator':
                                return <TranscribationOperatorItem key={index} item={item} />;
                            case 'customer':
                                return <TranscribationCustomerItem key={index} item={item} />;
                            default:
                                return null;
                        }
                    })
                ) : searchQuery.length >= 2 ? (
                    <div className={styles.noResults}>
                        По запросу "{searchQuery}" ничего не найдено
                    </div>
                ) : (
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
                )}
            </Flex>
        </Flex>
    );
};

export default TextTranscribationWidget;