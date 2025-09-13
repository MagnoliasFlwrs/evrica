import React, { useState, useRef, useEffect } from 'react';
import styles from '../../CallsFilteredLayout/CallsFilteredLayout.module.scss'
import DownArrow from "../CustomSelect/icons/DownArrow";

interface CustomPaginationSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    style?: React.CSSProperties;
}

const CustomPaginationSelect: React.FC<CustomPaginationSelectProps> = ({
                                                                           value,
                                                                           onChange,
                                                                           options,
                                                                           style
                                                                       }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={styles.CustomPaginationSelect} ref={dropdownRef}>
            <div
                className={styles.CustomPaginationSelectLabel}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption?.label || value}
                <DownArrow/>
            </div>

            {isOpen && (
                <div className={styles.CustomPaginationSelectOptions}
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={styles.CustomPaginationSelectOption}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomPaginationSelect;