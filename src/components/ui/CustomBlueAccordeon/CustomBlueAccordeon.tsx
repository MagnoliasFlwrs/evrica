import React, {useState, useRef, useEffect} from 'react';
import {Flex} from "antd";
import styles from "./CustomBlueAccordeon.module.scss";
import UpIconBlack from "./UpIconBlack";
import cn from "classnames";

interface ICustomBlueAccordeonProps {
    title: string;
    children?: React.ReactNode;
}

const CustomBlueAccordeon = ({title, children} : ICustomBlueAccordeonProps) => {
    const [open, setOpen] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>(0);

    const animateAccordeon = (targetOpen: boolean) => {
        if (!contentRef.current || isAnimating) return;

        setIsAnimating(true);
        const content = contentRef.current;

        const startHeight = content.offsetHeight;

        if (targetOpen) {
            content.style.height = 'auto';
            const targetHeight = content.scrollHeight;
            content.style.height = `${startHeight}px`;
            requestAnimationFrame(() => {
                startAnimation(startHeight, targetHeight, targetOpen);
            });
        } else {

            const targetHeight = 0;
            startAnimation(startHeight, targetHeight, targetOpen);
        }
    };

    const startAnimation = (startHeight: number, targetHeight: number, targetOpen: boolean) => {
        if (!contentRef.current) return;

        const content = contentRef.current;
        const startTime = performance.now();
        const duration = 300;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const currentHeight = startHeight + (targetHeight - startHeight) * ease;
            content.style.height = `${currentHeight}px`;

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                if (targetOpen) {
                    content.style.height = 'auto';
                } else {
                    content.style.height = '0px';
                    content.style.overflow = 'hidden';
                }
                setIsAnimating(false);
                setOpen(targetOpen);
            }
        };

        cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(animate);
    };

    const handleToggle = () => {
        if (isAnimating) return;
        animateAccordeon(!open);
    };

    useEffect(() => {
        if (contentRef.current && open) {
            contentRef.current.style.height = 'auto';
        }
    }, []);

    useEffect(() => {
        if (open && contentRef.current && !isAnimating) {
            contentRef.current.style.height = 'auto';
        }
    }, [children, open, isAnimating]);

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <Flex className={styles.CustomBlueAccordeonContainer}>
            <Flex className={styles.CustomBlueAccordeonContainerHead} onClick={handleToggle}>
                <p>{title}</p>
                <span
                    className={cn(styles.CustomBlueAccordeonContainerHeadIcon, { [styles.open]: open })}
                >
                    <UpIconBlack/>
                </span>
            </Flex>
            <Flex
                className={cn(styles.CustomBlueAccordeonContainerContent, { [styles.open]: open })}
                ref={contentRef}
            >
                <Flex className={styles.ContainerContent}>
                    {children}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default CustomBlueAccordeon;