import React, {useState} from 'react';
import PageContainer from "../components/ui/PageContainer/PageContainer";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import CategoriesFilter from "../components/CallsLayout/CategoriesFilter/CategoriesFilter";
import FilteredCallsBlock from "../components/CallsLayout/FilteredCallsBlock/FilteredCallsBlock";

const CallsLayout = () => {
    const [isSelected, setIsSelected] = useState(0);

    return (
        <PageContainer>
            <PageTitle text='Звонки'/>
            <CategoriesFilter setIsSelected={setIsSelected}/>
            <FilteredCallsBlock isSelected={isSelected}/>
        </PageContainer>
    );
};

export default CallsLayout;