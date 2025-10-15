import React, {useState} from 'react';
import styles from "../../AnalyticsReportLayout.module.scss";
import {Flex} from "antd";
import CustomTextModal from "../../../ui/CustomTextModal/CustomTextModal";

interface CheckList {
    title: string;
    percent: string;
    count: number;
}

interface MarkersWidgetAccordeonSlideProps {
    item: {
        title: string;
        percent: string;
        isUse: boolean;
        checkLists: CheckList[];
    };
    isOpen: boolean;
    contentHeight: number;
    contentRef: (el: HTMLDivElement | null) => void;
}
const MarkersWidgetAccordeonSlide = ({item, isOpen, contentHeight, contentRef}: MarkersWidgetAccordeonSlideProps) => {
    const percentNum = parseInt(item.percent);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const [isDangered, setIsDangered] = useState(false);

    const getTagClassName = (percent: string) => {
        const percentNum = parseInt(percent);
        if (percentNum < 50) return styles.CheckListsWidgetTagRed;
        if (percentNum < 70) return styles.CheckListsWidgetTagYellow;
        return styles.CheckListsWidgetTagGreen;
    };

    const getCheckListTagClassName = (percent: string) => {
        const percentNum = parseInt(percent);
        if (percentNum < 50) return styles.CheckListsWidgetTagGray;
        if (percentNum < 70) return styles.CheckListsWidgetTagYellow;
        return styles.CheckListsWidgetTagGreen;
    };

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    return (
        <Flex className={styles.CheckListsWidgetAccordeonSlideContainer}>
            <Flex className={styles.CheckListsWidgetAccordeonSlide}>
                <p>Всего</p>

                <p>
                    {
                        isDangered &&
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14"
                                   fill="none">
                              <path
                                  d="M14.4866 11L9.15329 1.66665C9.037 1.46146 8.86836 1.29078 8.66457 1.17203C8.46078 1.05329 8.22915 0.990723 7.99329 0.990723C7.75743 0.990723 7.52579 1.05329 7.322 1.17203C7.11822 1.29078 6.94958 1.46146 6.83329 1.66665L1.49995 11C1.38241 11.2036 1.32077 11.4346 1.32129 11.6697C1.32181 11.9047 1.38447 12.1355 1.50292 12.3385C1.62136 12.5416 1.79138 12.7097 1.99575 12.8259C2.20011 12.942 2.43156 13.0021 2.66662 13H13.3333C13.5672 12.9997 13.797 12.938 13.9995 12.8208C14.202 12.7037 14.3701 12.5354 14.487 12.3327C14.6038 12.1301 14.6653 11.9002 14.6653 11.6663C14.6652 11.4324 14.6036 11.2026 14.4866 11Z"
                                  stroke="#C3002A" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    }
                    130
                </p>
            </Flex>
            <Flex
                className={styles.AccordeonSlideChecklistsResults}
                ref={contentRef}
                style={{
                    maxHeight: isOpen ? contentHeight : 0,
                    opacity: isOpen ? 1 : 0,
                    transition: 'max-height 0.3s ease, opacity 0.2s ease',
                    overflow: 'hidden'
                }}
            >
                <Flex  className={styles.AccordeonSlideChecklistsResult}>
                    <Flex
                        className={styles.AccordeonSlideMarkerResult}
                        style={{ position: 'relative', cursor: 'pointer' }}
                    >
                        <Flex className={styles.AccordeonSlideMarkerResultGreen}>Обещали перезвонить</Flex>
                        <Flex className={styles.AccordeonSlideMarkerResultCount}>100</Flex>
                        {/*{hoveredIndex === index && (*/}
                        {/*    <CustomTextModal*/}
                        {/*        text='какой-то текст'*/}
                        {/*        left={true}*/}
                        {/*    />*/}
                        {/*)}*/}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default MarkersWidgetAccordeonSlide;