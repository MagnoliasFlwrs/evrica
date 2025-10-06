import React from 'react';
import {Flex} from "antd";
import styles from '../../AnalyticsReportLayout.module.scss'
import {Swiper, SwiperSlide} from "swiper/react";
import CallsSwiperItem from "./CallsSwiperItem";
import type { Swiper as SwiperType } from 'swiper';

const CallsWidgetSwiper = () => {
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
    ]
    return (
        <Flex className={styles.CallsWidgetSwiperContainer}>
            <Flex className={styles.SwiperContainer}>
                <Swiper
                    spaceBetween={20}
                    slidesPerView={4}
                    onSwiper={(swiper:SwiperType) => console.log(swiper)}
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