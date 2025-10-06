import React, { useRef, useState } from 'react';
import {Flex} from "antd";
import styles from '../../AnalyticsReportLayout.module.scss'
import {Swiper, SwiperSlide} from "swiper/react";
import { Navigation } from 'swiper/modules';
import CategoriesWidgetItem from "./CategoriesWidgetItem";
import PrevIcon from "./PrevIcon";
import NextIcon from "./NextIcon";
import type { Swiper as SwiperType } from 'swiper';

interface SwiperDataItem {
    title: string;
    checkListsPercent: number;
    negativeDictionary: number;
    positiveDictionary: number;
}

const CategoriesWidget = () => {
    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    const [swiperData, setSwiperData] = useState<SwiperDataItem[]>([
        {
            title:'Отдел по борьбе с нарушениями',
            checkListsPercent:90,
            negativeDictionary:0,
            positiveDictionary:7,
        },
        {
            title:'Операторы call-центра',
            checkListsPercent:77,
            negativeDictionary:10,
            positiveDictionary:9,
        },
        {
            title:'Просто прекрасный отдел',
            checkListsPercent:45,
            negativeDictionary:0,
            positiveDictionary:0,
        },
        {
            title:'Отдел по особо важным делам с очень длинным названием',
            checkListsPercent:67,
            negativeDictionary:8,
            positiveDictionary:4,
        },
        {
            title:'Великолепный прекрасный отдел',
            checkListsPercent:47,
            negativeDictionary:9,
            positiveDictionary:11,
        },
    ]);


    const handleDeleteItem = (index: number) => {
        if (swiperData.length > 1) {
            const newData = swiperData.filter((_, i) => i !== index);
            setSwiperData(newData);
        }
    };

    return (
        <Flex className={styles.CategoriesWidgetContainer}>
            <Flex className={styles.CategoriesWidgetContainerHead}>
                <p className={styles.WidgetTitle}>Выбранные категории</p>
                <Flex className={styles.SwiperControls}>
                    <Flex
                        className={styles.SwiperControl}
                        ref={navigationPrevRef}
                    >
                        <PrevIcon/>
                    </Flex>
                    <Flex
                        className={styles.SwiperControl}
                        ref={navigationNextRef}
                    >
                        <NextIcon/>
                    </Flex>
                </Flex>
            </Flex>
            <Flex className={styles.SwiperContainer}>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={4}
                    navigation={{
                        prevEl: navigationPrevRef.current,
                        nextEl: navigationNextRef.current,
                        disabledClass: styles.SwiperControlDisabled,
                    }}
                    onInit={(swiper: SwiperType) => {
                        swiperRef.current = swiper;

                        if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                            swiper.params.navigation.prevEl = navigationPrevRef.current;
                            swiper.params.navigation.nextEl = navigationNextRef.current;
                        }
                        swiper.navigation.init();
                        swiper.navigation.update();
                    }}
                >
                    {swiperData.map((item, index) => (
                        <SwiperSlide key={index}>
                            <CategoriesWidgetItem
                                title={item.title}
                                checkListsPercent={item.checkListsPercent}
                                negativeDictionary={item.negativeDictionary}
                                positiveDictionary={item.positiveDictionary}
                                onDelete={() => handleDeleteItem(index)}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Flex>
        </Flex>
    );
};

export default CategoriesWidget;