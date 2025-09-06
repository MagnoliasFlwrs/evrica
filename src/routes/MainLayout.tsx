import React from 'react';
import {Flex} from "antd";
import Sidebar from "../components/ui/Sidebar/Sidebar";
import {Outlet} from "react-router-dom";

const MainLayout = () => {
    return (
        <Flex style={{padding: '20px', height:"100vh"}} gap="30px" >
            <Sidebar/>
            <Outlet/>
        </Flex>
    );
};

export default MainLayout;