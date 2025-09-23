import React, { useEffect, useRef } from 'react';
import { Flex } from "antd";
import styles from '../CallSinglePageLayout.module.scss';
import CloseIcon from "../../ui/CustomSelect/icons/CloseIcon";
import {callsOptionsCheckListColors} from "../../CallsFilteredLayout/CallsOptions/utils";
import GreenCheck from "./GreenCheck";
import GrayCheck from "./GrayCheck";

interface CheckListItem {
    type: string;
    percent: string;
    checkListCompleting: number;
}

interface CheckListModalProps {
    position: { x: number; y: number } | null;
    onClose: () => void;
    item: CheckListItem | null; // Добавляем пропс item
}

const CheckListModal: React.FC<CheckListModalProps> = ({ position, onClose, item }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const modalStyle: React.CSSProperties = {
        position: 'fixed',
        left: position?.x || '50%',
        top: position?.y || '50%',
        transform: 'translate(-80%, -100%)',
        zIndex: 1000,
        marginTop: '-10px'
    };

    useEffect(() => {
        const updatePosition = () => {
            if (modalRef.current && position) {
                const rect = modalRef.current.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    modalRef.current.style.left = `${window.innerWidth - rect.width - 10}px`;
                }

                if (rect.left < 0) {
                    modalRef.current.style.left = '10px';
                }

                if (rect.bottom > window.innerHeight) {
                    modalRef.current.style.top = `${position.y - rect.height - 10}px`;
                    modalRef.current.style.transform = 'translate(-50%, 0%)';
                }
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, [position]);

    if (!item) return null;

    const getColorByPercent = (percent: string) => {
        const percentNumber = parseInt(percent.replace('%', ''), 10);
        if (percentNumber > 85) {
            return callsOptionsCheckListColors.green;
        } else if (percentNumber > 50) {
            return callsOptionsCheckListColors.orange;
        } else {
            return callsOptionsCheckListColors.gray;
        }
    };
    const colorConfig = getColorByPercent(item?.percent);

    return (
        <div ref={modalRef} style={modalStyle} className="checklist-modal-content">
            <Flex className={styles.CheckListModal}>
                <Flex className={styles.CheckListModalHead} >
                    <Flex className={styles.CheckListModalHeadName} >
                        <p>HR</p>
                        <Flex
                            className={styles.CallsOptionsCheckListsItemRowPercentMark}
                            style={{
                                backgroundColor: colorConfig.bgColor,
                                border: `1px solid ${colorConfig.color}`,
                                cursor: 'pointer'
                            }}

                        >
                            <span style={{ color: colorConfig.color }}>
                                {item?.percent}
                            </span>
                        </Flex>
                    </Flex>
                    <button onClick={onClose}>
                        <CloseIcon/>
                    </button>
                </Flex>
                <Flex className={styles.CheckListModalMarkCount}>
                    <p className={styles.CheckListModalMarkCountTitle}>Набранно баллов</p>
                    <p className={styles.CheckListModalMarkCountDescription}><span>85</span>/80</p>
                </Flex>
                <ul>
                    <li>
                        <p className={styles.CheckListModalMarkCountTitle}>параметр</p>
                        <GreenCheck/>
                    </li>
                    <li>
                        <p className={styles.CheckListModalMarkCountTitle}>параметр</p>
                        <GreenCheck/>
                    </li>
                    <li>
                        <p className={styles.CheckListModalMarkCountTitle}>параметр</p>
                        <GrayCheck/>
                    </li>
                    <li>
                        <p className={styles.CheckListModalMarkCountTitle}>параметр</p>
                        <GreenCheck/>
                    </li>
                    <li>
                        <p className={styles.CheckListModalMarkCountTitle}>параметр</p>
                        <GreenCheck/>
                    </li>
                </ul>
            </Flex>
        </div>
    );
};

export default CheckListModal;