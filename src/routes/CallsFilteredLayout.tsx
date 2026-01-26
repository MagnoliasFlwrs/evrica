import React, {useState, useEffect, useCallback} from 'react';
import PageContainer from "../components/ui/PageContainer/PageContainer";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import CallsFilteredLayoutControl from "../components/CallsFilteredLayout/CallsFilteredLayoutControl";
import {Value} from "../components/ui/CustomDatePicker/types";
import CallsOptionsContainer from "../components/CallsFilteredLayout/CallsOptions/CallsOptionsContainer";
import CallsTable from "../components/CallsFilteredLayout/CallsTable/CallsTable";
import CallsFilter from "../components/CallsFilteredLayout/CallsFilter/CallsFilter";
import {useCallsStore} from "../stores/callsStore";

const CallsFilteredLayout = () => {
    const [openCustomDatePicker, setOpenCustomDatePicker] = useState(false);

    const date_start = useCallsStore((state) => state.categoryCallsListObj.date_start);
    const date_end = useCallsStore((state) => state.categoryCallsListObj.date_end);
    const categoryCallsListObj = useCallsStore((state)=>state.categoryCallsListObj);
    const getCallsByCategoryId = useCallsStore((state)=> state.getCallsByCategoryId);
    const getChecklistsByCategoryId = useCallsStore((state)=> state.getChecklistsByCategoryId);
    const getDictionariesByCategoryId = useCallsStore((state)=> state.getDictionariesByCategoryId);

    const [selectedDate, setSelectedDate] = useState<Value>(() => {
        if (date_start && date_end) {
            return [new Date(date_start * 1000), new Date(date_end * 1000)];
        }
        return null;
    });

    useEffect(() => {
        if (date_start && date_end) {
            setSelectedDate([new Date(date_start * 1000), new Date(date_end * 1000)]);
        } else {
            setSelectedDate(null);
        }
    }, [date_start, date_end]);
    useEffect(() => {
        if (categoryCallsListObj.category_id) {
            getCallsByCategoryId();
            getChecklistsByCategoryId();
            getDictionariesByCategoryId()
        }
    }, [categoryCallsListObj]);

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
            <CallsFilter/>
            <CallsTable/>
        </PageContainer>
    );
};
export default CallsFilteredLayout;