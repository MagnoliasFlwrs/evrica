import React from 'react';
import {Flex} from "antd";
import styles from '../../AnalyticsReportLayout.module.scss'
import {Swiper, SwiperSlide} from "swiper/react";
import CallsSwiperItem from "./CallsSwiperItem";
import type { Swiper as SwiperType } from 'swiper';
import { useSwiperManager } from '../../hooks/SwiperManagerContext';

const CallsWidgetSwiper = () => {
    const { registerSwiper, unregisterSwiper, activeIndex } = useSwiperManager();

    const swiperData = [
        {
            total:130,
            outgoing:30,
            incoming:100,
            recognized:100
        },
        {
            total:100,
            outgoing:30,
            incoming:70,
            recognized:100
        },
        {
            total:130,
            outgoing:40,
            incoming:90,
            recognized:100
        },
        {
            total:130,
            outgoing:60,
            incoming:70,
            recognized:100
        },
        {
            total:130,
            outgoing:30,
            incoming:100,
            recognized:100
        },
    ];

    return (
        <Flex className={styles.CallsWidgetSwiperContainer}>
            <Flex className={styles.SwiperContainer}>
                <Swiper
                    spaceBetween={20}
                    slidesPerView={4}
                    allowTouchMove={false}
                    touchStartPreventDefault={false}
                    simulateTouch={false}
                    onSwiper={(swiper: SwiperType) => {
                        registerSwiper('calls', swiper);
                        // Синхронизируем с текущим активным индексом
                        if (swiper.activeIndex !== activeIndex) {
                            swiper.slideTo(activeIndex);
                        }
                    }}
                    onDestroy={() => unregisterSwiper('calls')}
                >
                    {swiperData.map((item, index) => (
                        <SwiperSlide key={index}>
                            <CallsSwiperItem item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Flex>
        </Flex>
    );
};

export default CallsWidgetSwiper;