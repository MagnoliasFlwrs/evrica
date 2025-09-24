import React from 'react';
import {Flex} from "antd";
import styles from '../components/LoginLayout/LoginLayout.module.scss'
import LoginForm from "../components/LoginLayout/LoginForm";

const LoginLayout = () => {
    return (
        <Flex className={styles.LoginLayout}>
            <h1>Вход</h1>
            <LoginForm />
        </Flex>
    );
};

export default LoginLayout;