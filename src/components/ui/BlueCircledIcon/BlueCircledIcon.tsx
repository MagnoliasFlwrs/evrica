import React from 'react';
import styles from './BlueCircledIcon.module.scss';

interface BlueCircledProps {
    icon: React.ReactNode;
    size?: number;
    onClick?: () => void;
}

const BlueCircledIcon:React.FC<BlueCircledProps> = ({icon , size = 32 , onClick}) => {
    return (
        <button className={styles.BlueCircledIcon}
                style={{width: size, height: size}}
                onClick={onClick}
        >
            {icon}
        </button>
    );
};

export default BlueCircledIcon;