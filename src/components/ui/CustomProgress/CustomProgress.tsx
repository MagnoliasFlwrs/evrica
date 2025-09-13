import React from 'react';
import { Flex, Progress } from "antd";
import styles from './CustomProgress.module.scss'

interface CustomProgressProps {
    title: string,
    percent: number
}

const CustomProgress: React.FC<CustomProgressProps> = ({ title, percent }) => {

    const getProgressColors = (percent: number) => {
        if (percent === 0) {
            return {
                strokeColor: '#E5E5E5',
                trailColor: '#E5E5E5'
            };
        } else if (percent > 0 && percent < 100) {
            return {
                strokeColor: '#007AFF',
                trailColor: 'rgba(0, 122, 255, 0.15)'
            };
        } else if (percent === 100) {
            return {
                strokeColor: '#00C310',
                trailColor: 'rgba(0, 195, 16, 0.15)'
            };
        }

        return {
            strokeColor: '#007AFF',
            trailColor: 'rgba(0, 122, 255, 0.15)'
        };
    };

    const colors = getProgressColors(percent);

    return (
        <Flex className={styles.CustomProgressContainer}>
            <div className={styles.progressWrapper}>
                <Progress
                    className={styles.CustomProgress}
                    type="circle"
                    percent={percent}
                    strokeColor={colors.strokeColor}
                    trailColor={colors.trailColor}
                    strokeWidth={12}
                    size={58}
                    showInfo={false}
                />
                <div className={styles.percentText}>
                    {percent === 100 ? '100%' : `${percent}%`}
                </div>
            </div>
            <p className={styles.CustomProgressContainerTitle}>{title}</p>
        </Flex>
    );
};

export default CustomProgress;