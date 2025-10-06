import React, {useState} from 'react';
import {Flex} from "antd";
import styles from "./CustomBlueAccordeon.module.scss";
import UpIconBlack from "./UpIconBlack";
import cn from "classnames";

interface ICustomBlueAccordeonProps {
    title: string;
    children?: React.ReactNode;
}

const CustomBlueAccordeon = ({title, children} : ICustomBlueAccordeonProps) => {
    const [open, setOpen] = useState(true);
    return (
        <Flex className={styles.CustomBlueAccordeonContainer}>
            <Flex className={styles.CustomBlueAccordeonContainerHead} onClick={() => setOpen(!open)}>
                <p>{title}</p>
                <span
                      className={cn(styles.CustomBlueAccordeonContainerHeadIcon, { [styles.open]: open })}
                >
                    <UpIconBlack/>
                </span>
            </Flex>
            <Flex className={cn(styles.CustomBlueAccordeonContainerContent, { [styles.open]: open })}>
                <Flex className={styles.ContainerContent}>
                    {children}
                </Flex>

            </Flex>
        </Flex>
    );
};

export default CustomBlueAccordeon;