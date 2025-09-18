import React from 'react';
import styles from './OutlinedButton.module.scss';


interface OutlinedButtonProps {
    text: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}
const OutlinedButton:React.FC<OutlinedButtonProps> = ({icon , text , onClick }) => {
    return (
        <button className={styles.OutlinedButton} onClick={onClick}>
            {icon && <span className={styles.icon}>{icon}</span>}
            <span className={styles.OutlinedButtonText}>{text}</span>
        </button>
    );
};

export default OutlinedButton;