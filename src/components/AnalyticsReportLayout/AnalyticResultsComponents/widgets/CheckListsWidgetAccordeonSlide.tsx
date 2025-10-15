import React, {useState} from 'react';
import {Flex} from "antd";
import styles from '../../AnalyticsReportLayout.module.scss'
import CustomTextModal from "../../../ui/CustomTextModal/CustomTextModal";

interface CheckList {
    title: string;
    percent: string;
    count: number;
}

interface CheckListsWidgetAccordeonSlideProps {
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

const CheckListsWidgetAccordeonSlide = ({item, isOpen, contentHeight, contentRef}: CheckListsWidgetAccordeonSlideProps) => {
    const percentNum = parseInt(item.percent);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
                {
                    item.isUse ? <p>{item.title}</p> : <p className={styles.notUseTitle}>Не применяется</p>
                }
                {
                    item.isUse && <Flex className={`${styles.CheckListsWidgetTag} ${getTagClassName(item.percent)}`}>
                        {item.percent}%
                    </Flex>
                }
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
                {
                    item.isUse && item.checkLists && item.checkLists.map((checkList, index) => (
                        <Flex key={index} className={styles.AccordeonSlideChecklistsResult}>
                            <p className={styles.count}>{checkList.count}</p>
                            <Flex
                                className={`${styles.CheckListsWidgetTag} ${getCheckListTagClassName(checkList.percent)}`}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                                style={{ position: 'relative', cursor: 'pointer' }}
                            >
                                {checkList.percent}%
                                {hoveredIndex === index && (
                                    <CustomTextModal
                                        text='какой-то текст'
                                        left={true}
                                    />
                                )}
                            </Flex>
                        </Flex>
                    ))
                }
            </Flex>
        </Flex>
    );
};

export default CheckListsWidgetAccordeonSlide;