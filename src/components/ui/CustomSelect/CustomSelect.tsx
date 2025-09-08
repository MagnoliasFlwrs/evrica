import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.scss';

export interface SelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options?: SelectOption[];
    multiple?: boolean;
    placeholder?: string;
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                       options = [],
                                                       multiple = false,
                                                       placeholder = "Выберите значение",
                                                       value = multiple ? [] : '',
                                                       onChange
                                                   }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedValues, setSelectedValues] = useState<string | string[]>(value);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setSelectedValues(value);
    }, [value]);

    const handleSelect = (optionValue: string) => {
        let newValues: string | string[];

        if (multiple) {
            const currentValues = Array.isArray(selectedValues) ? selectedValues : [];

            if (currentValues.includes(optionValue)) {
                newValues = currentValues.filter(val => val !== optionValue);
            } else {
                newValues = [...currentValues, optionValue];
            }
        } else {
            newValues = optionValue;
            setIsOpen(false);
        }

        setSelectedValues(newValues);
        if (onChange) {
            onChange(newValues);
        }
    };

    const removeSelectedValue = (valueToRemove: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (multiple) {
            const currentValues = Array.isArray(selectedValues) ? selectedValues : [];
            const newValues = currentValues.filter(val => val !== valueToRemove);

            setSelectedValues(newValues);
            if (onChange) {
                onChange(newValues);
            }
        } else {

            const newValues = '';
            setSelectedValues(newValues);
            if (onChange) {
                onChange(newValues);
            }
        }
    };

    const getDisplayText = (): React.ReactNode => {
        const values = multiple
            ? (Array.isArray(selectedValues) ? selectedValues : [])
            : (selectedValues ? [selectedValues as string] : []);

        if (values.length === 0) {
            return <span className={styles.placeholder}>{placeholder}</span>;
        }

        const firstValue = values[0];

        return (
            <div className={styles.selectedContent}>
                <span className={styles.placeholder}>{placeholder}:</span>
                {values.length === 1 ? (

                    <span className={styles.selectedTag}>
                        {options.find(opt => opt.value === firstValue)?.label || firstValue}
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={(e) => {
                                removeSelectedValue(firstValue, e);
                            }}
                        >
                            ×
                        </button>
                    </span>
                ) : (

                    <span className={styles.selectedCount}>
                        {values.length}
                    </span>
                )}
            </div>
        );
    };

    const isOptionSelected = (optionValue: string): boolean => {
        if (multiple) {
            const values = Array.isArray(selectedValues) ? selectedValues : [];
            return values.includes(optionValue);
        } else {
            return selectedValues === optionValue;
        }
    };

    return (
        <div className={styles.customSelect} ref={selectRef}>
            <div
                className={`${styles.selectHeader} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={styles.selectedValueContainer}>
                    {getDisplayText()}
                </div>
                <span className={styles.arrow}>
                    {isOpen ? '▲' : '▼'}
                </span>
            </div>

            {isOpen && (
                <div className={styles.selectOptions}>
                    {options.map(option => (
                        <div
                            key={option.value}
                            className={`${styles.option} ${isOptionSelected(option.value) ? styles.selected : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {multiple && (
                                <span className={styles.checkbox}>
                                    {isOptionSelected(option.value) ? '✓' : ''}
                                </span>
                            )}
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;