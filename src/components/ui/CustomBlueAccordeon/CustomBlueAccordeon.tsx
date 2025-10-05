import React, {useState} from 'react';
import {Flex} from "antd";
import styles from "./CustomBlueAccordeon.module.scss";
import UpIconBlack from "./UpIconBlack";
import cn from "classnames";

interface ICustomBlueAccordeonProps {
    title: string;
}

const CustomBlueAccordeon = ({title} : ICustomBlueAccordeonProps) => {
    const [open, setOpen] = useState(false);
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
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci animi, at consequatur delectus dignissimos dolores, expedita facilis fugiat maxime necessitatibus nemo numquam, obcaecati omnis pariatur perspiciatis quasi sequi soluta ut veniam. Commodi eaque earum eos facilis minus placeat quo suscipit voluptas. Beatae dolorem doloremque eveniet explicabo fugiat impedit labore mollitia nihil nisi officia omnis porro quae quis quo quod ratione repellendus saepe, sed sequi, tempora ut veritatis, vitae. Ad asperiores at cum, cumque incidunt inventore magnam minus necessitatibus, nihil omnis quo quos repellendus rerum sequi temporibus? Adipisci, at autem commodi debitis dolores ducimus ea facere id illo inventore laudantium nemo repudiandae ut vel veniam! Accusantium amet aspernatur cum deserunt dignissimos, doloremque eveniet, explicabo fugiat maiores nihil nobis nulla numquam perferendis placeat quaerat quas ratione temporibus veritatis vero voluptates. Eius expedita rerum temporibus. Debitis dolor dolore eligendi eveniet facilis id illum nemo omnis sint, unde. Accusamus aliquid amet aspernatur assumenda commodi consequatur cupiditate eligendi error eum facere fugit ipsum maiores, maxime, natus omnis perferendis placeat possimus provident quam quibusdam quis quod tempora tenetur veniam voluptatem. Possimus quisquam reiciendis tempora! Animi assumenda atque cupiditate dolore dolores dolorum, ea exercitationem illum inventore labore necessitatibus neque nesciunt nisi odit pariatur qui quisquam quo.
                </p>
            </Flex>
        </Flex>
    );
};

export default CustomBlueAccordeon;