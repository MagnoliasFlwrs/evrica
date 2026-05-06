import React, { useMemo, useState } from 'react';
import { Flex, Progress } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import styles from '../CallSinglePageLayout.module.scss';
import PlusIcon from "./PlusIcon";
import MinusIcon from "./MinusIcon";
import {getColorByPercent} from "../utils";
import {ChecklistsSearch} from "../../../stores/types/callsStoreTypes";


interface CallsOptionsCheckListsItemProps {
    item: ChecklistsSearch;
    setShowCheckListModal: (value: {
        show: boolean;
        position: { x: number; y: number } | null;
        item: ChecklistsSearch | null;
    }) => void;
}

const CallCheckListsItem: React.FC<CallsOptionsCheckListsItemProps> = ({ item, setShowCheckListModal }) => {
    const [isTriggered, setIsTriggered] = useState(false);

    const colorConfig = getColorByPercent(item?.limit_result);

    const dictionaryNames = useMemo(() => {
        const dictionaries = item?.checklist?.dictionaries as unknown as {
            system?: Array<{ name?: string; positive_weight?: number; dictionary?: { name?: string; found?: unknown[] } }>;
            client?: Array<{ name?: string; positive_weight?: number; dictionary?: { name?: string; found?: unknown[] } }>;
        } | undefined;

        const system = (dictionaries?.system ?? [])
            .map((d) => {
                const name = d?.name ?? d?.dictionary?.name;
                const found = d?.dictionary?.found ?? [];
                const triggered = Array.isArray(found) && found.length > 0;
                return name ? { name, triggered } : null;
            })
            .filter((x): x is { name: string; triggered: boolean } => Boolean(x))
            .sort((a, b) => Number(b.triggered) - Number(a.triggered) || a.name.localeCompare(b.name, 'ru'));

        const client = (dictionaries?.client ?? [])
            .map((d) => {
                const name = d?.name ?? d?.dictionary?.name;
                const found = d?.dictionary?.found ?? [];
                const triggered = Array.isArray(found) && found.length > 0;
                return name ? { name, triggered } : null;
            })
            .filter((x): x is { name: string; triggered: boolean } => Boolean(x))
            .sort((a, b) => Number(b.triggered) - Number(a.triggered) || a.name.localeCompare(b.name, 'ru'));

        const all = [...(dictionaries?.system ?? []), ...(dictionaries?.client ?? [])];
        const triggeredWeightSum = all.reduce((acc, d) => {
            const found = d?.dictionary?.found ?? [];
            if (!Array.isArray(found) || found.length === 0) return acc;
            return acc + (d?.positive_weight ?? 0);
        }, 0);

        const limit = Number(item?.limit_result ?? 0);
        const percent = limit > 0 ? Math.min(100, (triggeredWeightSum / limit) * 100) : 0;

        return { system, client, triggeredWeightSum, limit, percent };
    }, [item]);

    const handlePercentClick = (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setShowCheckListModal({
            show: true,
            position: {
                x: rect.left + rect.width / 2,
                y: rect.bottom
            },
            item: item
        });
    };

    return (
        <Flex className={styles.CallsOptionsCheckListsItem}>

            <Flex className={styles.CallsOptionsCheckListsItemRow}>
                <p className={styles.CallsOptionsCheckListsItemRowType}>{item?.checklist.name}</p>
                <Flex
                    className={styles.CallsOptionsCheckListsItemRowPercentMark}
                    style={{
                        backgroundColor: colorConfig.bgColor,
                        border: `1px solid ${colorConfig.color}`,
                        cursor: 'pointer'
                    }}
                    onClick={handlePercentClick}
                >
                    <span style={{ color: colorConfig.color }}>
                        {item?.limit_result}
                    </span>
                </Flex>
            </Flex>

            {(dictionaryNames.system.length > 0 || dictionaryNames.client.length > 0) && (
                <div
                    className={[
                        styles.triggeredDictionaries,
                        isTriggered ? styles.triggeredDictionariesOpen : styles.triggeredDictionariesClosed
                    ].join(' ')}
                    aria-hidden={!isTriggered}
                >
                    <div className={styles.triggeredProgressRow}>
                        <Progress
                            percent={Math.round(dictionaryNames.percent)}
                            size="small"
                        />
                    </div>
                    {dictionaryNames.system.length > 0 && (
                        <div className={styles.triggeredDictionariesGroup}>
                            <ul className={styles.triggeredDictionariesList}>
                                {dictionaryNames.system.map(({ name, triggered }) => (
                                    <li key={`system-${name}`}>
                                        <CheckCircleFilled
                                            className={styles.triggeredDictionaryIcon}
                                            style={{ color: triggered ? '#00C310' : '#FF3B30' }}
                                        />
                                        <span className={styles.triggeredDictionaryName}>{name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {dictionaryNames.client.length > 0 && (
                        <div className={styles.triggeredDictionariesGroup}>
                            <ul className={styles.triggeredDictionariesList}>
                                {dictionaryNames.client.map(({ name, triggered }) => (
                                    <li key={`client-${name}`}>
                                        <CheckCircleFilled
                                            className={styles.triggeredDictionaryIcon}
                                            style={{ color: triggered ? '#00C310' : '#FF3B30' }}
                                        />
                                        <span className={styles.triggeredDictionaryName}>{name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className={styles.triggeredFootnote}>
                        <div className={styles.triggeredFootnoteText}>
                            <p>Необходимый результат для выполнения чек-листа: {dictionaryNames.limit}</p>
                            <p>Набрано баллов: {dictionaryNames.triggeredWeightSum}</p>
                        </div>

                        {(() => {
                            const limit = dictionaryNames.limit;
                            const score = dictionaryNames.triggeredWeightSum;

                            const status =
                                limit > 0 && score >= limit
                                    ? { text: 'выполнен', kind: 'success' as const }
                                    : score > 0
                                        ? { text: 'частично выполнен', kind: 'partial' as const }
                                        : { text: 'не выполнен', kind: 'fail' as const };

                            return (
                                <span
                                    className={[
                                        styles.triggeredStatusTag,
                                        status.kind === 'success'
                                            ? styles.triggeredStatusTagSuccess
                                            : status.kind === 'partial'
                                                ? styles.triggeredStatusTagPartial
                                                : styles.triggeredStatusTagFail
                                    ].join(' ')}
                                >
                                    {status.text}
                                </span>
                            );
                        })()}
                    </div>
                </div>
            )}
            {isTriggered ? (
                <button className={styles.showTriggered} onClick={() => setIsTriggered(false)}>
                    <span className={styles.triggeredIcon}>
                        <PlusIcon/>
                    </span>
                    Убрать срабатывание
                </button>
            ) : (
                <button className={styles.showTriggered} onClick={() => setIsTriggered(true)}>
                    <span className={styles.noTriggeredIcon}>
                        <MinusIcon/>
                    </span>
                    Показать срабатывание
                </button>
            )}
        </Flex>
    );
};

export default CallCheckListsItem;