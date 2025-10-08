// contexts/SwiperManagerContext.tsx
import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';
import type { Swiper as SwiperType } from 'swiper';

interface SwiperManagerContextType {
    registerSwiper: (id: string, swiper: SwiperType) => void;
    unregisterSwiper: (id: string) => void;
    navigateAll: (direction: 'prev' | 'next') => void;
    deleteAllSlides: (index: number) => void;
    activeIndex: number;
}

const SwiperManagerContext = createContext<SwiperManagerContextType | undefined>(undefined);

export const useSwiperManager = () => {
    const context = useContext(SwiperManagerContext);
    if (!context) {
        throw new Error('useSwiperManager must be used within a SwiperManagerProvider');
    }
    return context;
};

interface SwiperManagerProviderProps {
    children: ReactNode;
}

export const SwiperManagerProvider: React.FC<SwiperManagerProviderProps> = ({ children }) => {
    const swipersRef = useRef<Map<string, SwiperType>>(new Map());
    const [activeIndex, setActiveIndex] = useState(0);

    const registerSwiper = (id: string, swiper: SwiperType) => {
        swipersRef.current.set(id, swiper);

        // Синхронизация активного слайда только для навигации
        swiper.on('slideChange', () => {
            if (swiper.activeIndex !== activeIndex) {
                setActiveIndex(swiper.activeIndex);
                syncAllSwipers(swiper.activeIndex);
            }
        });
    };

    const unregisterSwiper = (id: string) => {
        swipersRef.current.delete(id);
    };

    const navigateAll = (direction: 'prev' | 'next') => {
        swipersRef.current.forEach((swiper) => {
            if (direction === 'prev') {
                swiper.slidePrev();
            } else {
                swiper.slideNext();
            }
        });
    };

    const deleteAllSlides = (index: number) => {
        swipersRef.current.forEach((swiper) => {
            if (swiper.slides.length > 1) {
                const slide = swiper.slides[index];
                if (slide) {
                    slide.remove();
                    swiper.update();
                }
            }
        });

        const firstSwiper = Array.from(swipersRef.current.values())[0];
        if (firstSwiper) {
            setActiveIndex(firstSwiper.activeIndex);
        }
    };

    const syncAllSwipers = (index: number) => {
        swipersRef.current.forEach((swiper, id) => {
            if (swiper.activeIndex !== index && swiper.slides[index]) {
                swiper.slideTo(index);
            }
        });
    };

    return (
        <SwiperManagerContext.Provider value={{
            registerSwiper,
            unregisterSwiper,
            navigateAll,
            deleteAllSlides,
            activeIndex,
        }}>
            {children}
        </SwiperManagerContext.Provider>
    );
};