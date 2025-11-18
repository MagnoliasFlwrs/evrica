import React, {useEffect, useState} from 'react';
import PageContainer from "../components/ui/PageContainer/PageContainer";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import CategoriesFilter from "../components/CallsLayout/CategoriesFilter/CategoriesFilter";
import FilteredCallsBlock from "../components/CallsLayout/FilteredCallsBlock/FilteredCallsBlock";
import {useCallsStore} from "../stores/callsStore";

const CallsLayout = () => {
    const [isSelected, setIsSelected] = useState(0);
    const getPendingCalls = useCallsStore((state)=>state.getPendingCalls);
    const getCallsCategories = useCallsStore((state)=>state.getCallsCategories);
    const categoryCallsListObj = useCallsStore((state)=>state.categoryCallsListObj);
    const getCallsByCategoryId = useCallsStore((state)=>state.getCallsByCategoryId);
    const getChecklistsByCategoryId = useCallsStore((state)=>state.getChecklistsByCategoryId);
    const getDictionariesByCategoryId = useCallsStore((state)=>state.getDictionariesByCategoryId);

    useEffect(() => {
        getCallsCategories();
    }, []);
    useEffect(() => {
        if(categoryCallsListObj.category_id) {
            getCallsByCategoryId();
            getChecklistsByCategoryId();
            getDictionariesByCategoryId();
        }
    }, [categoryCallsListObj]);

    return (
        <PageContainer>
            <PageTitle text='Звонки'/>
            <CategoriesFilter setIsSelected={setIsSelected}/>
            <FilteredCallsBlock isSelected={isSelected}/>
        </PageContainer>
    );
};

export default CallsLayout;