import React, {useEffect, useMemo, useState} from 'react';
import {Flex} from "antd";
import styles from '../CallSinglePageLayout.module.scss'
import BaseSelect from "../../ui/BaseSelect/BaseSelect";
import {useCallsStore} from "../../../stores/callsStore";
import {getBaseSystemResult, getRecommendationsForSelect} from "../aiJsonBaseSystem";

const RecomendationWidget = () => {
    const aiJsonList = useCallsStore((state) => state.aiJsonList);

    const baseResult = useMemo(() => getBaseSystemResult(aiJsonList), [aiJsonList]);
    const categories = useMemo(() => getRecommendationsForSelect(baseResult), [baseResult]);

    const selectData = categories
        ? Object.keys(categories).map((key) => ({
              value: key,
              label: key.replace(/_/g, ' '),
          }))
        : [];

    const [selectedCategory, setSelectedCategory] = useState<string>('маркетинг');

    useEffect(() => {
        if (!categories) return;
        const keys = Object.keys(categories);
        if (keys.length && !keys.includes(selectedCategory)) {
            setSelectedCategory(keys[0]);
        }
    }, [categories, selectedCategory]);

    const handleChange = (value: string | string[]) => {
        if (Array.isArray(value)) {
            setSelectedCategory(value[0] || 'маркетинг');
        } else {
            setSelectedCategory(value);
        }
    };

    const currentRecommendation =
        categories && selectedCategory
            ? categories[selectedCategory]
            : undefined;

    return (
        <Flex className={styles.RecomendationWidget}>
            <Flex className={styles.RecomendationWidgetHead}>
                <p>Рекомендации</p>
                {selectData.length > 0 && (
                    <BaseSelect
                        value={selectedCategory}
                        onChange={handleChange}
                        options={selectData}
                        placeholder="Выберите категорию"
                    />
                )}
            </Flex>
            {currentRecommendation && (
                <Flex className={styles.RecomendationWidgetHeadRecommendation}>
                    <Flex className={styles.RecommendationRow}>
                        <p>Действие</p>
                        <span>{currentRecommendation.действие}</span>
                    </Flex>
                    <Flex className={styles.RecommendationRow}>
                        <p>Приоритет</p>
                        <span>{currentRecommendation.приоритет}</span>
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
};

export default RecomendationWidget;
