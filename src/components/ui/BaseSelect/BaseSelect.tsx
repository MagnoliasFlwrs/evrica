import React, { useEffect, useRef, useState } from 'react';
import { SelectOption } from "../CustomSelect/CustomSelect";
import styles from "./BaseSelect.module.scss";
import DownArrow from "../CustomSelect/icons/DownArrow";
import CloseIcon from "../CustomSelect/icons/CloseIcon";
import Check from "../CustomSelect/icons/Check";

export interface BaseSelectOption {
    value: string;
    label: string;
}

interface BaseSelectProps {
    options?: BaseSelectOption[];
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    width?: string;
    isHaveHeader?: boolean;
    isOutlined?: boolean;
}

const BaseSelect: React.FC<BaseSelectProps> = ({
                                                   options = [],
                                                   placeholder = "Выберите значение",
                                                   value,
                                                   onChange,
                                                   width = 'auto',
                                                   isHaveHeader = true,
                                                    isOutlined = false,
                                               }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const baseSelectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (baseSelectRef.current && !baseSelectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const isOptionSelected = (optionValue: string): boolean => {
        return value === optionValue;
    };

    const handleSelect = (selectedValue: string) => {
        if (onChange) {
            onChange(selectedValue);
            setIsOpen(false);
        }
    };

    const getDisplayText = (): string => {
        if (!value) {
            return placeholder;
        }

        const selectedOption = options.find(opt => opt.value === value);
        return selectedOption?.label || value;
    };

    return (
        <div
            className={styles.baseSelect}
            ref={baseSelectRef}
            style={{ width }}
        >
            <div
                className={`${styles.selectHeader}
                 ${isOpen ? styles.open : ''}
                 ${isOutlined ? styles.outlined : ''}
                 `}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={styles.selectedValueContainer}>
                    {getDisplayText()}
                </div>
                <span className={styles.arrow}>
                        <DownArrow/>
                    </span>
            </div>


            {isOpen && (
                <div className={styles.selectOptions}>
                    {
                        isHaveHeader &&
                        <div className={styles.optionsHeader}>
                            <span className={styles.optionsTitle}>{placeholder}</span>
                            <button
                                type="button"
                                className={styles.closeButton}
                                onClick={() => setIsOpen(false)}
                            >
                                <CloseIcon/>
                            </button>
                        </div>
                    }


                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`${styles.option} ${isOptionSelected(option.value) ? styles.selected : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                            <span className={styles.checkbox}>
                                {isOptionSelected(option.value) ? <Check/> : ''}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BaseSelect;