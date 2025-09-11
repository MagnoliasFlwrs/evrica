import React from 'react';
import {Flex} from "antd";
import Sidebar from "../components/ui/Sidebar/Sidebar";
import {Outlet} from "react-router-dom";

const MainLayout = () => {
    return (
        <Flex style={{padding: '20px', minHeight:"100vh" , width:"100vw"}}  >
            <Sidebar/>
            <Outlet/>
        </Flex>
    );
};

export default MainLayout;