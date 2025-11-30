import React, {useEffect, useState} from 'react';
import {Flex} from "antd";
import styles from '../CallsOptions.module.scss'
import CallsOptionsCheckListsItem from "./CallsOptionsCheckListsItem";
import CustomSwiper from "../../../ui/CustomSwiper/CustomSwiper";
import {useCallsStore} from "../../../../stores/callsStore";
import {ChecklistsSearch} from "../../../../stores/types/callsStoreTypes";

const CallsOptionsCheckLists = () => {
    const categoriesChecklistsList = useCallsStore((state)=> state.categoriesChecklistsList);
    const [checkListData, setCheckListData] = useState<ChecklistsSearch[]>([]);

    useEffect(() => {
        if (categoriesChecklistsList) {
            setCheckListData(categoriesChecklistsList)
            console.log("CategoriesCheckLists", categoriesChecklistsList)
        }
    }, [categoriesChecklistsList])

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