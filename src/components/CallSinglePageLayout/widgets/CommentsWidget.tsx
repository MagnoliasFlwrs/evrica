import React, {useEffect, useMemo, useState} from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import {Flex, notification} from "antd";

import PlusIcon from "../icons/PlusIcon";
import CustomTextModal from "../../ui/CustomTextModal/CustomTextModal";
import BlueCircledIcon from "../../ui/BlueCircledIcon/BlueCircledIcon";
import SendBtn from "../../icons/SendBtn";
import MoreCommentsModal from "../modals/MoreCommentsModal";
import {useCallsStore} from "../../../stores/callsStore";
import {useParams} from "react-router-dom";
import {formatDateTime} from "../utils";

const CommentsWidget = () => {
    const [openModal, setOpenModal] = useState(false);
    const [addCommentInput, setAddCommentInput] = useState(false);
    const [openMoreCommentsModal, setOpenMoreCommentsModal] = useState(false);
    const comments= useCallsStore((state)=>state.comments);
    const saveComment = useCallsStore((state)=>state.saveComment);
    const currentCallInfo = useCallsStore((state) => state.currentCallInfo);
    const getCallComments = useCallsStore((state) => state.getCallComments);
    const loading = useCallsStore((state) => state.loading);
    const { id: currentCallId } = useParams();
    const [categoryId, setCategoryId] = React.useState<string | number>('');
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        if(currentCallInfo) {
            setCategoryId(currentCallInfo?.call?.category_id)
        }
    }, [currentCallInfo]);

    const callInfoId = useMemo(
        () => currentCallInfo?.id ?? currentCallId ?? '',
        [currentCallId, currentCallInfo?.id]
    );

    const handleAddCommentClick = () => {
        setAddCommentInput(true);
    }
    useEffect(() => {
        addCommentInput && setOpenModal(false) ;
    }, [addCommentInput])

    const renderedComments = Array.isArray(comments) ? comments : [];
    const previewComments = renderedComments.slice(0, 2);
    const moreComments = renderedComments.slice(2);

    const handleSend = async () => {
        const text = commentText.trim();
        if (!text) return;
        if (!callInfoId) return;
        if (!categoryId) return;

        const res = await saveComment(callInfoId, categoryId, text);
        if (res) {
            notification.success({ message: 'Комментарий сохранён' });
            setCommentText('');
            setAddCommentInput(false);
            await getCallComments(callInfoId);
        }
    };

    return (
        <Flex className={styles.CommentsWidget}>
            <Flex className={styles.CommentsWidgetHead}>
                <p>Комментарии</p>
            </Flex>
            <Flex className={styles.CommentsWidgetList}>
                {previewComments.map((c: any, idx: number) => (
                    <Flex className={styles.CommentsWidgetListItem} key={c?.id ?? idx}>
                        <p>{c?.created_at ? formatDateTime(c.created_at) : ''}</p>
                        <span>{c?.comment ?? c?.text ?? ''}</span>
                    </Flex>
                ))}
            </Flex>
            {
                addCommentInput &&
                <Flex className={styles.addCommentInputContainer}>
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSend();
                        }}
                        placeholder="Введите комментарий"
                    />
                    <BlueCircledIcon icon={<SendBtn/>} size={20} onClick={handleSend}/>

                </Flex>
            }
            <Flex className={styles.CommentsWidgetControls}>
                {moreComments.length > 0 && (
                    <Flex
                        className={styles.CommentsWidgetShowMore}
                        onMouseEnter={() => setOpenMoreCommentsModal(true)}
                        onMouseLeave={() => setOpenMoreCommentsModal(false)}
                    >
                        <p className={styles.CommentsWidgetShowMoreTitle}>Еще</p>
                        <span className={styles.CommentsWidgetShowMoreCount}>
                            {moreComments.length}
                        </span>
                        {openMoreCommentsModal && <MoreCommentsModal comments={moreComments}/>}
                    </Flex>
                )}
                <button onClick={() => setOpenModal(true)} disabled={loading}>
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