import React, {useState} from 'react';
import {Flex, Input} from "antd";
import CustomSelect from "../../ui/CustomSelect/CustomSelect";
import styles from '../CallsFilteredLayout.module.scss'
import SearchIcon from "../../ui/CustomSelect/icons/SearchIcon";

const CallsFilter = () => {
    const [callType, setCallType] = useState<string>('');
    const [callTypes, setCallTypes] = useState<string[]>([]);

    const callTypeOptions = [
        { value: 'incoming', label: 'Входящие' },
        { value: 'outgoing', label: 'Исходящие' },
        { value: 'missed', label: 'Пропущенные' }
    ];
    const markersOptions = [
        { value: 'promise', label: 'Обещали перезвонить' },
        { value: 'dontwant', label: 'не хочу' },
        { value: 'expencive', label: 'Возражение “Дорого”' },
        { value: 'donthelp', label: 'не помогли' },
    ];


    return (
        <Flex className={styles.CallsFilter}>
            <Flex className={styles.CallsFilterTitleRow}>
                <p className={styles.CallsFilterTitle}>Список звонков</p>
                <Input
                    prefix={<SearchIcon />}
                    placeholder='Поиск по id или номеру телефона'
                    className={styles.CallsFilterInput}
                />
            </Flex>
            <Flex className={styles.CallsFilterPanel}>
                <CustomSelect
                    options={callTypeOptions}
                    multiple={false}
                    placeholder="Тип звонка"
                    value={callType}
                    onChange={(value) => {
                        if (typeof value === 'string') {
                            setCallType(value);
                        }
                    }}
                />
                <CustomSelect
                    options={markersOptions}
                    multiple={true}
                    placeholder="Типы звонков"
                    value={callTypes}
                    tag={true}
                    onChange={(value) => {
                        if (Array.isArray(value)) {
                            setCallTypes(value);
                        }
                    }}
                />
            </Flex>
        </Flex>
    );
};

export default CallsFilter;