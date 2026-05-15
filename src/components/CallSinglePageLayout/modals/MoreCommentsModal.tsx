import React from 'react';
import {Flex} from "antd";
import styles from '../CallSinglePageLayout.module.scss'
import {formatDateTime} from "../utils";

interface MoreCommentsModalProps {
    comments: any[];
}

const MoreCommentsModal: React.FC<MoreCommentsModalProps> = ({ comments }) => {
    return (
        <Flex className={styles.MoreCommentsModal}>
            <ul>
                {comments.map((c: any, idx: number) => (
                    <li key={c?.id ?? idx}>
                        <span>{c?.created_at ? formatDateTime(c.created_at) : ''}</span>
                        <p>{c?.comment ?? c?.text ?? ''}</p>
                    </li>
                ))}
            </ul>
        </Flex>
    );
};

export default MoreCommentsModal;