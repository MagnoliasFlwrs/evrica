import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Flex } from "antd";
import styles from './CustomSwiper.module.scss';
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Swiper as SwiperCore } from 'swiper/types';

interface CarouselProps {
    data: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
}

const CustomSwiper: React.FC<CarouselProps> = ({ data, renderItem  }) => {
    const swiperRef = useRef<any>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    return (
        <Flex className={styles.CustomSwiper}>
            <div
                className={`${styles.customSwiperButton} ${styles.customSwiperButtonPrev} ${
                    isBeginning ? styles.disabled : ''
                }`}
                onClick={() => !isBeginning && swiperRef.current?.slidePrev()}
            >
                <LeftOutlined />
            </div>

            <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={4}
                onSwiper={(swiper: SwiperCore) => {
                    swiperRef.current = swiper;
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                onSlideChange={(swiper: SwiperCore) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                navigation={false}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={index}>
                        {renderItem(item, index)}
                    </SwiperSlide>
                ))}
            </Swiper>

            <div
                className={`${styles.customSwiperButton} ${styles.customSwiperButtonNext} ${
                    isEnd ? styles.disabled : ''
                }`}
                onClick={() => !isEnd && swiperRef.current?.slideNext()}
            >
                <RightOutlined />
            </div>
        </Flex>
    );
};

export default CustomSwiper;