import React from 'react';
import PageContainer from "../components/ui/PageContainer/PageContainer";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import CategoriesFilter from "../components/CallsLayout/CategoriesFilter/CategoriesFilter";

const CallsLayout = () => {
    return (
        <PageContainer>
            <PageTitle text='Звонки'/>
            <CategoriesFilter/>
        </PageContainer>
    );
};

export default CallsLayout;