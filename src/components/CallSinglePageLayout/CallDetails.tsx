import React, {useCallback, useState, useEffect} from 'react';
import {Flex} from "antd";
import styles from './CallSinglePageLayout.module.scss'
import CustomSwiper from "../ui/CustomSwiper/CustomSwiper";
import CallMarkerItem from "./CallSwipersItems/CallMarkerItem";
import CallCheckListsItem from "./CallSwipersItems/CallCheckListsItem";
import CheckListModal from "./CallSwipersItems/CheckListModal";
import Portal from "./Portal";
import {checkListData, markersData} from "./mockData";
import MarkerModal from "./CallSwipersItems/MarkerModal";
import {CheckListModalState, MarkerModalState} from "./types";

const CallDetails = () => {
    const [modalState, setModalState] = useState<CheckListModalState>({
        show: false,
        position: { x: 0, y: 0 },
        item: null
    });

    const [markerModalState, setMarkerModalState] = useState<MarkerModalState>({
        show: false,
        position: { x: 0, y: 0 },
        item: null
    });

    // Закрытие модалок при клике вне области
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Если открыта модалка чек-листа
            if (modalState.show) {
                const modalElement = document.querySelector('.checklist-modal-content');
                if (modalElement && !modalElement.contains(event.target as Node)) {
                    handleCloseModal();
                }
            }

            // Если открыта модалка маркера
            if (markerModalState.show) {
                const modalElement = document.querySelector('.marker-modal-content');
                if (modalElement && !modalElement.contains(event.target as Node)) {
                    handleCloseMarkerModal();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [modalState.show, markerModalState.show]);

    const handleCloseModal = () => {
        setModalState({
            show: false,
            position: { x: 0, y: 0 },
            item: null
        });
    };

    const handleCloseMarkerModal = () => {
        setMarkerModalState({
            show: false,
            position: { x: 0, y: 0 },
            item: null
        });
    };

    // Функции для открытия модалок с автоматическим закрытием другой
    const handleOpenCheckListModal = (state: CheckListModalState) => {
        // Закрываем модалку маркера если открыта
        if (markerModalState.show) {
            handleCloseMarkerModal();
        }
        setModalState(state);
    };

    const handleOpenMarkerModal = (state: MarkerModalState) => {
        // Закрываем модалку чек-листа если открыта
        if (modalState.show) {
            handleCloseModal();
        }
        setMarkerModalState(state);
    };

    return (
        <Flex className={styles.CallDetailsContainer}>
            <p className={styles.CallDetailsContainerTile}>Детали разговора</p>
            <Flex className={styles.CallDetailsChecklistsContainer}>
                <p className={styles.CallDetailsContainerSubTile}>Чек-листы</p>
                <CustomSwiper
                    data={checkListData}
                    renderItem={(item, index) => (
                        <CallCheckListsItem
                            item={item}
                            key={index}
                            setShowCheckListModal={handleOpenCheckListModal}
                        />
                    )}
                />
            </Flex>

            <p className={styles.CallDetailsContainerSubTile}>Маркеры</p>
            <CustomSwiper
                data={markersData}
                renderItem={(item, index) => (
                    <CallMarkerItem
                        item={item}
                        key={index}
                        setShowMarkerModal={handleOpenMarkerModal}
                    />
                )}
            />

            <Portal isOpen={modalState.show}>
                <CheckListModal
                    position={modalState.position}
                    onClose={handleCloseModal}
                    item={modalState.item}
                />
            </Portal>
            <Portal isOpen={markerModalState.show}>
                <MarkerModal
                    position={markerModalState.position}
                    onClose={handleCloseMarkerModal}
                    item={markerModalState.item}
                />
            </Portal>
        </Flex>
    );
};

export default CallDetails;