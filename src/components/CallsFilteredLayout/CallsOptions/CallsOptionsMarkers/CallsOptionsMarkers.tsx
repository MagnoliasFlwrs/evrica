import React, {useEffect, useState} from 'react';
import styles from "../CallsOptions.module.scss";
import {Flex} from "antd";
import CustomSwiper from "../../../ui/CustomSwiper/CustomSwiper";
import CallsOptionsMarkerItem from "./CallsOptionsMarkerItem";
import {useCallsStore} from "../../../../stores/callsStore";
import {CategoriesDictionariesList} from "../../../../stores/types/callsStoreTypes";


const CallsOptionsMarkers = () => {
    const categoriesDictionariesList = useCallsStore((state)=> state.categoriesDictionariesList);
    const [dictionariesList, setDictionariesList] = useState<CategoriesDictionariesList>({
        system: [],
        client: []
    });

    useEffect(() => {
        if(categoriesDictionariesList) {
            setDictionariesList(categoriesDictionariesList);
        }
    }, [categoriesDictionariesList]);

    const data = [
        {
            type: "Возражение “Дорого”",
            count: 4
        },
        {
            type: "не хочу",
            count: 1
        },
        {
            type: "Обещали перезвонить",
            count: 8
        },
        {
            type: "не помогли",
            count: 6
        },
        {
            type: "Возражение “Дорого”",
            count: 4
        },
        {
            type: "не хочу",
            count: 1
        },
        {
            type: "Обещали перезвонить",
            count: 8
        },
        {
            type: "не помогли",
            count: 6
        },
    ]
    return (
        <>
            {
                dictionariesList &&
                <Flex className={styles.CallsOptionsListsContainer}>
                    <p>Маркеры</p>
                    <CustomSwiper
                        data={data}
                        renderItem={(item, index) => (
                            <CallsOptionsMarkerItem item={item} key={index} />
                        )}
                    />
                </Flex>
            }
        </>

    );
};

export default CallsOptionsMarkers;