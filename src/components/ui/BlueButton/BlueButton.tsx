import React from 'react';
import styles from './BlueButton.module.scss';

interface BlueButtonProps {
    text: string;
    className?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    iconPosition?: 'start' | 'end';
}

const BlueButton = ({
                        text,
                        className,
                        onClick,
                        icon,
                        iconPosition = 'start'
                    }: BlueButtonProps) => {
    return (
        <button
            className={`${styles.blueButton} ${className}`}
            onClick={onClick}
        >
            {icon && iconPosition === 'start' && (
                <span className={styles.iconStart}>{icon}</span>
            )}
            <span className={styles.buttonText}>{text}</span>
            {icon && iconPosition === 'end' && (
                <span className={styles.iconEnd}>{icon}</span>
            )}
        </button>
    );
};

export default BlueButton;