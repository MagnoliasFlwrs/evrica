import React, {useState} from 'react';
import {Flex} from "antd";
import styles from '../CallSinglePageLayout.module.scss'
import CustomSelect from "../../ui/CustomSelect/CustomSelect";

const RecomendationWidget = () => {
    const [category, setCategory] = useState<string>('marketing');
    const selectData = [
        { value: 'marketing', label: 'Маркетинг' },
        { value: 'business', label: 'Операционный бизнес' },
        { value: 'quality', label: 'Качество обслуживания' }
    ];

    const handleChange = (value: string | string[]) => {

        if (Array.isArray(value)) {
            setCategory(value[0] || 'marketing');
        } else {
            setCategory(value);
        }
    };

    return (
        <Flex className={styles.RecomendationWidget}>
            <Flex className={styles.RecomendationWidgetHead}>
                <p>Рекомендации</p>
                <CustomSelect
                    value={category}
                    onChange={handleChange}
                    options={selectData}
                    placeholder="Выберите категорию"
                />
            </Flex>
        </Flex>
    );
};

export default RecomendationWidget;