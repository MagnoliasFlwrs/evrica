import React, { useState } from 'react';
import { Flex } from "antd";
import styles from './CustomSwitcher.module.scss'
import cn from "classnames";

interface CustomSwitcherProps {
    items: { title: string; }[],
    disable?: boolean,
    setSelectedSwitchItem?: (value: number) => void,
}

const CustomSwitcher: React.FC<CustomSwitcherProps> = ({ items, disable = false, setSelectedSwitchItem }) => {
    const [activeIndex, setActiveIndex] = useState<number>(items.length > 1 ? 1 : 0);

    const handleItemClick = (index: number, e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setActiveIndex(index);
        if (setSelectedSwitchItem) {
            setSelectedSwitchItem(index);
        }
    };

    const getSwitcherPosition = () => {
        if (items.length === 2) {
            return activeIndex === 0
                ? { left: '10px' }
                : { left: 'calc(54% - 10px)' };
        } else if (items.length === 3) {
            switch (activeIndex) {
                case 0:
                    return { left: '10px' };
                case 1:
                    return { left: '50%', transform: 'translateX(-50%)' };
                case 2:
                    return { left: 'calc(54% - 10px)' };
                default:
                    return { left: '10px' };
            }
        }
        return { left: '10px', right: 'unset' };
    };

    return (
        <Flex className={cn(styles.CustomSwitcherContainer, { [styles.disable]: disable })}>
            <span
                className={styles.Switcher}
                style={getSwitcherPosition()}
            ></span>
            {items?.map((item, index) => (
                <a
                    key={index}
                    href='#'
                    className={`${styles.SwitcherItem} ${
                        activeIndex === index ? styles.active : ''
                    }`}
                    onClick={(e) => handleItemClick(index, e)}
                >
                    {item.title}
                </a>
            ))}
        </Flex>
    );
};

export default CustomSwitcher;