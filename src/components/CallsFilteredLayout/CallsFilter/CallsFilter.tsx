import React, {useState} from 'react';
import {Flex} from "antd";
import CustomSelect from "../../ui/CustomSelect/CustomSelect";

const CallsFilter = () => {
    const [callType, setCallType] = useState<string>('');
    const [callTypes, setCallTypes] = useState<string[]>([]);

    const callTypeOptions = [
        { value: 'incoming', label: 'Входящие' },
        { value: 'outgoing', label: 'Исходящие' },
        { value: 'missed', label: 'Пропущенные' }
    ];
    const handleCallTypesChange = (value: string | string[]) => {
        if (Array.isArray(value)) {
            setCallTypes(value);
        }
    };

    return (
        <Flex>
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
                options={callTypeOptions}
                multiple={true}
                placeholder="Типы звонков"
                value={callTypes}
                onChange={(value) => {
                    if (Array.isArray(value)) {
                        setCallTypes(value);
                    }
                }}
            />
        </Flex>
    );
};

export default CallsFilter;