import React from 'react';
import styles from './BlueCircledIcon.module.scss';

interface BlueCircledProps {
    icon: React.ReactNode;
}

const BlueCircledIcon:React.FC<BlueCircledProps> = ({icon}) => {
    return (
        <button className={styles.BlueCircledIcon}>
            {icon}
        </button>
    );
};

export default BlueCircledIcon;