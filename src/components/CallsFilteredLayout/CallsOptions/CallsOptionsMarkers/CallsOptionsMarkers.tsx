import React, {useEffect, useState} from 'react';
import styles from "../CallsOptions.module.scss";
import {Flex, Spin} from "antd";
import CustomSwiper from "../../../ui/CustomSwiper/CustomSwiper";
import CallsOptionsMarkerItem from "./CallsOptionsMarkerItem";
import {useCallsStore} from "../../../../stores/callsStore";
import {
    CategoriesDictionariesList,
    CategoryDictionary,
    CategoryDictionaryFullDataObj,
    Dictionary,
} from "../../../../stores/types/callsStoreTypes";

type MarkerRow = {
    type: string;
    count: number;
    colorSuccess?: string;
    id?: number | string;
};

const mapPayloadToMarker = (payload: unknown, entry: CategoryDictionary): MarkerRow | null => {
    let dictionary: Dictionary | undefined = entry.dictionary;
    if (payload != null && typeof payload === 'object') {
        const pl = payload as { dictionary?: Dictionary } & Partial<Dictionary>;
        if (pl.dictionary) {
            dictionary = pl.dictionary;
        } else if ('name' in pl && 'found_count_by_period' in pl) {
            dictionary = pl as Dictionary;
        }
    }

    if (!dictionary?.name) return null;

    const allPeriod = dictionary.found_count_by_period?.all;
    const count = Array.isArray(allPeriod)
        ? allPeriod.length
        : typeof allPeriod === 'number'
          ? allPeriod
          : 0;

    const colorSuccess = dictionary.color_success ?? entry.color_success ?? undefined;

    return {
        type: dictionary.name,
        count: typeof count === 'number' ? count : 0,
        colorSuccess: colorSuccess ?? undefined,
        id: dictionary.id ?? entry.dictionary_id,
    };
};

const CallsOptionsMarkers = () => {
    const dictionariesByIdList = useCallsStore((state) => state.dictionariesByIdList);
    const checkListsByIdObj = useCallsStore((state) => state.checkListsByIdObj);
    const fetchCategoryDictionaryFullData = useCallsStore(
        (state) => state.fetchCategoryDictionaryFullData,
    );

    const [dictionariesList, setDictionariesList] = useState<CategoriesDictionariesList>({
        system: [],
        client: [],
    });
    const [markerData, setMarkerData] = useState<MarkerRow[]>([]);
    const [markersLoading, setMarkersLoading] = useState(false);

    useEffect(() => {
        if (dictionariesByIdList && 'system' in dictionariesByIdList && 'client' in dictionariesByIdList) {
            setDictionariesList(dictionariesByIdList as CategoriesDictionariesList);
        }
    }, [dictionariesByIdList]);

    useEffect(() => {
        const entries: CategoryDictionary[] = [
            ...(dictionariesList?.system ?? []),
            ...(dictionariesList?.client ?? []),
        ];

        const category_id = checkListsByIdObj.category_id;
        const date_start = checkListsByIdObj.date_start;
        const date_end = checkListsByIdObj.date_end;

        if (
            entries.length === 0 ||
            category_id === '' ||
            category_id === null ||
            date_start == null ||
            date_end == null
        ) {
            setMarkerData([]);
            setMarkersLoading(false);
            return;
        }

        let cancelled = false;
        setMarkersLoading(true);

        const run = async () => {
            const rows = await Promise.all(
                entries.map(async (entry) => {
                    const dictionary_id = entry.dictionary_id;
                    const dictionary_type = entry.dictionary_type;
                    if (
                        dictionary_id === null ||
                        dictionary_id === undefined ||
                        (dictionary_type !== 'system' && dictionary_type !== 'client')
                    ) {
                        return mapPayloadToMarker(null, entry);
                    }

                    const params: CategoryDictionaryFullDataObj = {
                        category_id,
                        dictionary_id,
                        dictionary_type,
                        date_start,
                        date_end,
                    };

                    const payload = await fetchCategoryDictionaryFullData(params);
                    if (cancelled) return null;
                    return mapPayloadToMarker(payload ?? null, entry);
                }),
            );

            if (!cancelled) {
                setMarkerData(rows.filter((r): r is MarkerRow => r != null));
                setMarkersLoading(false);
            }
        };

        void run();

        return () => {
            cancelled = true;
        };
    }, [
        dictionariesList,
        checkListsByIdObj.category_id,
        checkListsByIdObj.date_start,
        checkListsByIdObj.date_end,
        fetchCategoryDictionaryFullData,
    ]);

    return (
        <>
            {dictionariesList && (
                <Flex className={styles.CallsOptionsListsContainer}>
                    <p>Маркеры</p>
                    {markersLoading ? (
                        <Flex justify="center" align="center" style={{ minHeight: 48 }}>
                            <Spin />
                        </Flex>
                    ) : (
                        <CustomSwiper
                            data={markerData}
                            renderItem={(item, index) => (
                                <CallsOptionsMarkerItem item={item} key={item?.id ?? index} />
                            )}
                        />
                    )}
                </Flex>
            )}
        </>
    );
};

export default CallsOptionsMarkers;
