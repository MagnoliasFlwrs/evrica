import React, {useMemo} from 'react';
import {Flex} from "antd";
import styles from "../CallsOptions.module.scss";
import CloseIcon from "../../../ui/CustomSelect/icons/CloseIcon";
import {ChecklistsSearch} from "../../../../stores/types/callsStoreTypes";

interface MarkerModalProps {
    item: ChecklistsSearch;
    onClose: () => void;
}

const MarkerModal = ({ item, onClose }: MarkerModalProps) => {
    const sortedRows = useMemo(() => {
        const dicts = [
            ...(item?.checklist?.dictionaries?.system ?? []),
            ...(item?.checklist?.dictionaries?.client ?? []),
        ] as Array<Record<string, unknown> & { dictionary?: Record<string, unknown>; name?: string }>;

        return dicts
            .map((d) => {
                const dict = (d.dictionary ?? d) as Record<string, unknown> & {
                    name?: string;
                    found_count_by_period?: { all?: unknown[] };
                };
                const all = dict?.found_count_by_period?.all;
                const len = Array.isArray(all) ? all.length : 0;
                const name = (dict?.name ?? d?.name ?? '') as string;
                return { name, count: len };
            })
            .sort((a, b) => b.count - a.count);
    }, [item]);
    console.log(item);
    return (
        <Flex className={styles.filterModalOverlay} onClick={onClose}>
            <Flex
                className={styles.filterModal}
                onClick={(e) => e.stopPropagation()}
            >
                <Flex className={styles.filterModalClose}>
                    <p>{item.checklist.name}</p>
                    <span className={styles.filterModalCloseIcon} onClick={onClose} role="button" tabIndex={0}>
                        <CloseIcon/>
                    </span>
                </Flex>
                <Flex className={styles.markerModalDictionaryList}>
                    {sortedRows.map((row, idx) => (
                        <Flex key={`${row.name}-${idx}`} className={styles.markerModalDictionaryRow}>
                            <span className={styles.markerModalDictionaryName}>{row.name}</span>
                            <span className={styles.markerModalDictionaryCount}>{row.count}</span>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default MarkerModal;
