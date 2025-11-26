import React, {useEffect, useState} from 'react';
import {Flex} from "antd";
import styles from '../CallSinglePageLayout.module.scss'
import BaseSelect from "../../ui/BaseSelect/BaseSelect";
import {AiSystemAnswer} from "../../../stores/types/callsStoreTypes";
import {useCallsStore} from "../../../stores/callsStore";

// Добавляем типы для рекомендаций
interface Recommendation {
    действие: string;
    приоритет: string;
}

interface Recommendations {
    маркетинг: Recommendation;
    операционный_бизнес: Recommendation;
    качество_обслуживания: Recommendation;
}

const RecomendationWidget = () => {
    const aiJsonList = useCallsStore((state) => state.aiJsonList);
    const [systemJsonList, setSystemJsonList] = useState<AiSystemAnswer[]>([]);

    useEffect(() => {
        if (aiJsonList && aiJsonList.length > 0) {
            const firstAiJson = aiJsonList[0];
            const filteredSystem = firstAiJson.answers.system.filter((item: AiSystemAnswer) =>
                item.name === 'БАЗОВЫЙ СИСТЕМНЫЙ'
            );
            setSystemJsonList(filteredSystem);
        }
    }, [aiJsonList]);

    const categories = systemJsonList[0]?.result?.рекомендации as Recommendations | undefined;

    // Создаем selectData на основе categories
    const selectData = categories ? Object.keys(categories).map(key => ({
        value: key,
        label: key.replace('_', ' ') // Заменяем нижние подчеркивания на пробелы
    })) : [];

    // Устанавливаем "маркетинг" по умолчанию
    const [selectedCategory, setSelectedCategory] = useState<string>('маркетинг');

    const handleChange = (value: string | string[]) => {
        if (Array.isArray(value)) {
            setSelectedCategory(value[0] || 'маркетинг');
        } else {
            setSelectedCategory(value);
        }
    };

    // Получаем текущую рекомендацию на основе выбранной категории
    const currentRecommendation = categories && selectedCategory
        ? categories[selectedCategory as keyof Recommendations]
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