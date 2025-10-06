import { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';

export const useSwiperNavigation = () => {
    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);
    const swipersRef = useRef<SwiperType[]>([]);

    const registerSwiper = (swiper: SwiperType) => {
        swipersRef.current.push(swiper);
    };

    const unregisterSwiper = (swiper: SwiperType) => {
        swipersRef.current = swipersRef.current.filter(s => s !== swiper);
    };

    return {
        navigationPrevRef,
        navigationNextRef,
        registerSwiper,
        unregisterSwiper,
        swipersRef
    };
};