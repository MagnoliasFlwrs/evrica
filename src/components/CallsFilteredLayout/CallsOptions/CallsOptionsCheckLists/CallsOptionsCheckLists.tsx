import React, {useEffect, useState} from 'react';
import {Flex, Spin} from "antd";
import styles from '../CallsOptions.module.scss'
import CallsOptionsCheckListsItem from "./CallsOptionsCheckListsItem";
import MarkerModal from "./MarkerModal";
import CustomSwiper from "../../../ui/CustomSwiper/CustomSwiper";
import {useCallsStore} from "../../../../stores/callsStore";
import {ChecklistsSearch} from "../../../../stores/types/callsStoreTypes";

const CallsOptionsCheckLists = () => {
    const checkListsByIdList = useCallsStore((state)=> state.checkListsByIdList);
    const loading = useCallsStore((state)=> state.loading);
    const [checkListData, setCheckListData] = useState<ChecklistsSearch[]>([]);
    const [modalItem, setModalItem] = useState<ChecklistsSearch | null>(null);

    useEffect(() => {
        if (checkListsByIdList) {
            setCheckListData(checkListsByIdList)

        }
    }, [checkListsByIdList])

    return (
        <>
            {
                loading && <Spin/>
            }
            {
                checkListData.length > 0 &&
                <Flex className={styles.CallsOptionsListsContainer}>
                    <p>Чек-листы</p>
                    <CustomSwiper
                        data={checkListData}
                        renderItem={(item, index) => (
                            <CallsOptionsCheckListsItem
                                item={item}
                                key={item?.id ?? index}
                                onOpen={setModalItem}
                            />
                        )}
                    />
                </Flex>
            }
            {modalItem && (
                <MarkerModal item={modalItem} onClose={() => setModalItem(null)} />
            )}
        </>

    );
};

export default CallsOptionsCheckLists;