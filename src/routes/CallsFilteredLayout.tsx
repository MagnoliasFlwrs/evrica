import React, {useState} from 'react';
import PageContainer from "../components/ui/PageContainer/PageContainer";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import CallsFilteredLayoutControl from "../components/CallsFilteredLayout/CallsFilteredLayoutControl";
import {Value} from "../components/ui/CustomDatePicker/types";
import CallsOptionsContainer from "../components/CallsFilteredLayout/CallsOptions/CallsOptionsContainer";

const CallsFilteredLayout = () => {
    const [openCustomDatePicker, setOpenCustomDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Value>([new Date(2025, 3, 11), new Date(2025, 8, 19)]);

    const handleDateChange = (date: Value) => {
        setSelectedDate(date);
    };

    return (
        <PageContainer>
            <PageTitle text='Звонки'/>
            <CallsFilteredLayoutControl
                openCustomDatePicker={openCustomDatePicker}
                setOpenCustomDatePicker={setOpenCustomDatePicker}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />
            <CallsOptionsContainer/>
        </PageContainer>
    );
};
export default CallsFilteredLayout;