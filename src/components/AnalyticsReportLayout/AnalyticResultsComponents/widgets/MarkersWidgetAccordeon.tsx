import React, {useEffect, useRef, useState} from 'react';
import {useSwiperManager} from "../../hooks/SwiperManagerContext";
import {swiperData, swiperMarkersData} from "./mockData";
import {measureElementHeight} from "../helpers";
import {Flex} from "antd";
import styles from "../../AnalyticsReportLayout.module.scss";
import DownArrow from "../../../ui/CustomSelect/icons/DownArrow";
import type {Swiper as SwiperType} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import MarkersWidgetAccordeonSlide from "./MarkersWidgetAccordeonSlide";

const MarkersWidgetAccordeon = () => {
    const { registerSwiper, unregisterSwiper, activeIndex } = useSwiperManager();
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [headListHeight, setHeadListHeight] = useState(0);

    const headListRef = useRef<HTMLDivElement>(null);
    const slideContentRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        slideContentRefs.current = slideContentRefs.current.slice(0, swiperMarkersData.length);
    }, [swiperMarkersData.length]);

    const toggleAccordion = () => {
        setIsAccordionOpen(!isAccordionOpen);
    };

    useEffect(() => {
        if (headListRef.current) {
            const height = measureElementHeight(headListRef.current);
            setHeadListHeight(height);
        }
    }, [isAccordionOpen]);

    const setHeadListRef = (el: HTMLDivElement | null) => {
        headListRef.current = el;
        if (el) {
            setTimeout(() => {
                const height = measureElementHeight(el);
                setHeadListHeight(height);
            }, 0);
        }
    };

    const setSlideContentRef = (index: number) => (el: HTMLDivElement | null) => {
        slideContentRefs.current[index] = el;
    };

    const getSlideContentHeight = (index: number): number => {
        const contentElement = slideContentRefs.current[index];
        if (!contentElement) return 0;
        return measureElementHeight(contentElement);
    };

    return (
        <Flex className={styles.CheckListsWidgetAccordeon}>
            <Flex className={styles.CheckListsWidgetAccordeonHeadRow}>
                <Flex className={styles.CheckListsWidgetAccordeonHeadColumn}>
                    <Flex
                        className={styles.CheckListsWidgetAccordeonHead}
                        onClick={toggleAccordion}
                        style={{ cursor: 'pointer' }}
                    >
                        <p>Очень длинное название</p>
                        <span style={{
                            transform: isAccordionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                        }}>
                            <DownArrow/>
                        </span>
                    </Flex>
                    <Flex
                        className={styles.CheckListsWidgetAccordeonHeadList}
                        style={{
                            maxHeight: isAccordionOpen ? headListHeight : 0,
                            opacity: isAccordionOpen ? 1 : 0,
                            transition: 'max-height 0.3s ease, opacity 0.2s ease',
                            overflow: 'hidden'
                        }}
                        ref={setHeadListRef}
                    >
                        {/*<p>Чеклист 1</p>*/}
                        {/*<p>Чеклист 2</p>*/}
                        {/*<p>Чеклист 3</p>*/}
                        {/*<p>Квалификация клиента по региону</p>*/}
                    </Flex>
                </Flex>

                <Flex className={styles.CheckListsWidgetAccordeonHeadRowSwiper}>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={4}
                        allowTouchMove={false}
                        touchStartPreventDefault={false}
                        simulateTouch={false}
                        onSwiper={(swiper: SwiperType) => {
                            registerSwiper('markers', swiper);

                            if (swiper.activeIndex !== activeIndex) {
                                swiper.slideTo(activeIndex);
                            }
                        }}
                        onDestroy={() => unregisterSwiper('markers')}
                    >
                        {swiperMarkersData.map((item, index) => (
                            <SwiperSlide key={index}>
                                <MarkersWidgetAccordeonSlide
                                    item={item}
                                    isOpen={isAccordionOpen}
                                    contentHeight={getSlideContentHeight(index)}
                                    contentRef={setSlideContentRef(index)}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default MarkersWidgetAccordeon;