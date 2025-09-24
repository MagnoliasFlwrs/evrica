import React, {useEffect, useState} from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import {Flex} from "antd";

import PlusIcon from "../icons/PlusIcon";
import CustomTextModal from "../../ui/CustomTextModal/CustomTextModal";
import BlueCircledIcon from "../../ui/BlueCircledIcon/BlueCircledIcon";
import SendBtn from "../../icons/SendBtn";
import MoreCommentsModal from "../modals/MoreCommentsModal";

const CommentsWidget = () => {
    const [openModal, setOpenModal] = useState(false);
    const [addCommentInput, setAddCommentInput] = useState(false);
    const [openMoreCommentsModal, setOpenMoreCommentsModal] = useState(false);

    const handleAddCommentClick = () => {
        setAddCommentInput(true);
    }
    useEffect(() => {
        addCommentInput && setOpenModal(false) ;
    }, [addCommentInput])

    return (
        <Flex className={styles.CommentsWidget}>
            <Flex className={styles.CommentsWidgetHead}>
                <p>Комментарии</p>
            </Flex>
            <Flex className={styles.CommentsWidgetList}>
                <Flex className={styles.CommentsWidgetListItem}>
                    <p>11 апр 2025 11:45</p>
                    <span>Звонок записан не до коцна</span>
                </Flex>
                <Flex className={styles.CommentsWidgetListItem}>
                    <p>11 апр 2025 11:45</p>
                    <span>Оператор не поздоровался и не предложил товар
                        Оператор не поздоровался и не предложил товар
                        Оператор не поздоровался и не предложил товар
                        Оператор не поздоровался и не предложил товар
                        Оператор не поздоровался и не предложил товар
                        Оператор не поздоровался и не предложил товар
                        Оператор не поздоровался и не предложил товар
                        Оператор не поздоровался и не предложил товар</span>
                </Flex>
            </Flex>
            {
                addCommentInput &&
                <Flex className={styles.addCommentInputContainer}>
                    <input type="text"/>
                    <BlueCircledIcon icon={<SendBtn/>} size={20}/>

                </Flex>
            }
            <Flex className={styles.CommentsWidgetControls}>
                <Flex className={styles.CommentsWidgetShowMore}
                      onMouseEnter={() => setOpenMoreCommentsModal(true)}
                      onMouseLeave={() => setOpenMoreCommentsModal(false)}
                >
                    <p className={styles.CommentsWidgetShowMoreTitle}>Еще</p>
                    <span className={styles.CommentsWidgetShowMoreCount}
                    >
                        4
                    </span>
                    {
                        openMoreCommentsModal && <MoreCommentsModal/>
                    }
                </Flex>
                <button onClick={() => setOpenModal(true)}>
                    <PlusIcon/>
                    {
                        openModal &&
                        <CustomTextModal
                            text='Добавить комментарий'
                            left={true}
                            bottom={true}
                            onClick={()=>handleAddCommentClick()}
                        />
                    }

                </button>
            </Flex>
        </Flex>
    );
};

export default CommentsWidget;