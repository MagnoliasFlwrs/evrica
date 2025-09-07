import React from 'react';
import styles from './BlueButton.module.scss';

interface BlueButtonProps {
    text: string;
    className?: string;
    onClick?: () => void;
}

const BlueButton = ({text, className, onClick}: BlueButtonProps) => {
    return (
        <button className={`${styles.blueButton} ${className}`} onClick={onClick}>
            {text}
        </button>
    );
};

export default BlueButton;