import React, {useEffect, useState} from 'react';
import {Flex} from "antd";
import styles from '../CallsOptions.module.scss'
import CallsOptionsCheckListsItem from "./CallsOptionsCheckListsItem";
import CustomSwiper from "../../../ui/CustomSwiper/CustomSwiper";
import {useCallsStore} from "../../../../stores/callsStore";
import {ChecklistsSearch} from "../../../../stores/types/callsStoreTypes";

const CallsOptionsCheckLists = () => {
    const checkListsByIdList = useCallsStore((state)=> state.checkListsByIdList);
    const [checkListData, setCheckListData] = useState<ChecklistsSearch[]>([]);

    useEffect(() => {
        if (checkListsByIdList) {
            setCheckListData(checkListsByIdList)
            console.log("CategoriesCheckLists", checkListsByIdList)
        }
    }, [checkListsByIdList])

    return (
        <>
            {
                checkListData.length > 0 &&
                <Flex className={styles.CallsOptionsListsContainer}>
                    <p>Чек-листы</p>
                    <CustomSwiper
                        data={checkListData}
                        renderItem={(item, index) => (
                            <CallsOptionsCheckListsItem item={item} key={index} />
                        )}
                    />
                </Flex>
            }
        </>

    );
};

export default CallsOptionsCheckLists;