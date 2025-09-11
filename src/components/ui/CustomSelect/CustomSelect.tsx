import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.scss';
import CloseIcon from "./icons/CloseIcon";
import {Flex, Input, Tag} from "antd";
import DownArrow from "./icons/DownArrow";
import Check from "./icons/Check";
import SearchIcon from "./icons/SearchIcon";

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
    tag?: boolean
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                       options = [],
                                                       multiple = false,
                                                       placeholder = "Выберите значение",
                                                       value = multiple ? [] : '',
                                                       onChange,
                                                       tag = false
                                                   }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedValues, setSelectedValues] = useState<string | string[]>(value);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const selectRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
        if (isOpen && multiple && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, multiple]);

    const handleSelect = (optionValue: string) => {
        let newValues: string | string[];

        if (multiple) {
            const currentValues = Array.isArray(selectedValues) ? selectedValues : [];

            if (optionValue === 'any') {

                if (currentValues.length === filteredOptions.length) {
                    newValues = [];
                } else {
                    newValues = filteredOptions.map(opt => opt.value);
                }
            } else {
                if (currentValues.includes(optionValue)) {
                    newValues = currentValues.filter(val => val !== optionValue);
                } else {
                    newValues = [...currentValues, optionValue];
                }
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
            // Для single select очищаем значение (устанавливаем "Любой")
            const newValues = '';
            setSelectedValues(newValues);
            if (onChange) {
                onChange(newValues);
            }
        }
    };

    const clearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newValues = multiple ? [] : '';
        setSelectedValues(newValues);
        if (onChange) {
            onChange(newValues);
        }
    };

    const getDisplayText = (): React.ReactNode => {
        const values = multiple
            ? (Array.isArray(selectedValues) ? selectedValues : [])
            : (selectedValues ? [selectedValues as string] : []);

        // Если выбрано пустое значение (Любой) в single select
        if (!multiple && selectedValues === '') {
            return <span className={styles.placeholder}>{placeholder}</span>;
        }

        if (values.length === 0) {
            return <span className={styles.placeholder}>{placeholder}</span>;
        }

        const firstValue = values[0];

        return (
            <div className={styles.selectedContent}>
                <span className={styles.placeholder}>{placeholder}:</span>
                {values.length === 1 ? (
                    <Flex className={styles.selectedOptions}>
                    <span className={styles.selectedTag}>
                        {options.find(opt => opt.value === firstValue)?.label || firstValue}
                    </span>
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={(e) => {
                                removeSelectedValue(firstValue, e);
                            }}
                        >
                            <CloseIcon/>
                        </button>
                    </Flex>

                ) : (
                    <Flex className={styles.selectedOptions}>
                    <span className={styles.selectedCount}>
                        {values.length}
                    </span>
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={clearAll}
                        >
                            <CloseIcon/>
                        </button>
                    </Flex>

                )}
            </div>
        );
    };

    const isOptionSelected = (optionValue: string): boolean => {
        if (multiple) {
            const values = Array.isArray(selectedValues) ? selectedValues : [];
            return values.includes(optionValue);
        } else {

            if (optionValue === '') {
                return selectedValues === '';
            }
            return selectedValues === optionValue;
        }
    };

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const allSelected = multiple &&
        Array.isArray(selectedValues) &&
        selectedValues.length === filteredOptions.length &&
        filteredOptions.length > 0;

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
                    <DownArrow />
                </span>
            </div>

            {isOpen && (
                <div className={styles.selectOptions}>

                    <div className={styles.optionsHeader}>
                        <span className={styles.optionsTitle}>{placeholder}</span>
                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={() => setIsOpen(false)}
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {multiple && (
                        <div className={styles.searchContainer}>
                            <Input
                                type="text"
                                placeholder="Поиск по списку"
                                prefix={<SearchIcon />}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    {!multiple && (
                        <div
                            className={`${styles.optionAll} ${isOptionSelected('') ? styles.selected : ''}`}
                            onClick={() => handleSelect('')}
                        >
                            Любой
                            <span className={styles.checkbox}>
                                {isOptionSelected('') ? <Check/> : ''}
                            </span>
                        </div>
                    )}

                    {filteredOptions.map(option => (
                        <div
                            key={option.value}
                            className={`${styles.option} ${isOptionSelected(option.value) ? styles.selected : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {
                                tag ?
                                    <Tag className={`${styles.tag} ${styles[option.value]}`}>
                                        {option.label}
                                    </Tag>
                                    :
                                    <span>{option.label}</span>
                            }

                            <span className={styles.checkbox}>
                                {isOptionSelected(option.value) ? <Check/> : ''}
                            </span>
                        </div>
                    ))}

                    {filteredOptions.length === 0 && (
                        <div className={styles.noOptions}>
                            Ничего не найдено
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;