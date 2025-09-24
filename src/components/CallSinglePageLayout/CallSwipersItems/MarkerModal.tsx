import React, { useEffect, useRef } from 'react';
import { Flex } from "antd";
import styles from '../CallSinglePageLayout.module.scss';
import CloseIcon from "../../ui/CustomSelect/icons/CloseIcon";
import GreenCheck from "./GreenCheck";
import GrayCheck from "./GrayCheck";
import {getColorByPercent} from "../utils";
import {MarkerModalProps} from "../types";
import {callsOptionsMarkersColors} from "../../CallsFilteredLayout/CallsOptions/utils";



const MarkerModal: React.FC<MarkerModalProps> = ({ position, onClose, item  }) => {
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

    const getColorByMarkerType = () => {
        switch(item?.type.toLowerCase()) {
            case 'возражение "дорого"':
                return callsOptionsMarkersColors.blue;
            case 'не хочу':
                return callsOptionsMarkersColors.aqua;
            case 'oбещали перезвонить':
                return callsOptionsMarkersColors.green;
            case 'не помогли':
                return callsOptionsMarkersColors.purple;
            default:
                return callsOptionsMarkersColors.blue;
        }
    };

    const colorConfig = getColorByMarkerType();

    return (
        <div ref={modalRef} style={modalStyle} className="marker-modal-content">
            <Flex className={styles.CheckListModal}>
                <Flex className={styles.CheckListModalHead} >
                    <Flex className={styles.CheckListModalHeadName} >
                        <Flex
                            className={styles.CallsOptionsMark}
                            style={{
                                backgroundColor: colorConfig.bgColor,
                                color: colorConfig.color
                            }}
                        >
                            {item?.type}
                        </Flex>
                    </Flex>
                    <button onClick={onClose}>
                        <CloseIcon/>
                    </button>
                </Flex>
                <ul>
                    <li>
                        <p className={styles.CheckListModalMarkCountTitle}>параметр</p>
                        <p className={styles.CheckListModalMarkCountTitle}>1</p>
                    </li>
                    <li>
                        <p className={styles.CheckListModalMarkCountTitle}>параметр</p>
                        <p className={styles.CheckListModalMarkCountTitle}>1</p>
                    </li>
                    <li>
                        <p className={styles.CheckListModalMarkCountTitle}>параметр</p>
                        <p className={styles.CheckListModalMarkCountTitle}>1</p>
                    </li>
                    <li>
                        <p className={styles.CheckListModalMarkCountTitle}>параметр</p>
                        <p className={styles.CheckListModalMarkCountTitle}>1</p>
                    </li>
                    <li>
                        <p className={styles.CheckListModalMarkCountTitle}>параметр</p>
                        <p className={styles.CheckListModalMarkCountTitle}>1</p>
                    </li>
                </ul>
            </Flex>
        </div>
    );
};

export default MarkerModal;