import React, {useCallback, useState} from 'react';
import {Flex} from "antd";
import styles from './CallSinglePageLayout.module.scss'
import CustomSwiper from "../ui/CustomSwiper/CustomSwiper";
import CallMarkerItem from "./CallSwipersItems/CallMarkerItem";
import CallCheckListsItem from "./CallSwipersItems/CallCheckListsItem";
import CheckListModal from "./CallSwipersItems/CheckListModal";
import Portal from "./Portal";
import {checkListData, markersData} from "./mockData";

interface CheckListItem {
    type: string;
    percent: string;
    checkListCompleting: number;

}

interface ModalState {
    show: boolean;
    position: { x: number; y: number } | null;
    item: CheckListItem | null;
}

const CallDetails = () => {
    const [modalState, setModalState] = useState<ModalState>({
        show: false,
        position: { x: 0, y: 0 },
        item: null
    });

    const handleCloseModal = () => {
        setModalState({
            show: false,
            position: { x: 0, y: 0 },
            item: null
        });
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
                            setShowCheckListModal={setModalState}
                        />
                    )}
                />
            </Flex>

            <p className={styles.CallDetailsContainerSubTile}>Маркеры</p>
            <CustomSwiper
                data={markersData}
                renderItem={(item, index) => (
                    <CallMarkerItem item={item} key={index} />
                )}
            />

            <Portal isOpen={modalState.show}>
                <CheckListModal
                    position={modalState.position}
                    onClose={handleCloseModal}
                    item={modalState.item}
                />
            </Portal>
        </Flex>
    );
};

export default CallDetails;