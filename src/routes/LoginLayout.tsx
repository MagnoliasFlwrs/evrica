import React, {useEffect} from 'react';
import {Flex} from "antd";
import styles from '../components/LoginLayout/LoginLayout.module.scss'
import LoginForm from "../components/LoginLayout/LoginForm";
import {useAuth} from "../store";
import {useNavigate} from "react-router-dom";


const LoginLayout = () => {
    const isAuth = useAuth((state) => state.isAuth);
    const accessToken = useAuth((state) => state.accessToken);

    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken || isAuth ) {
            navigate('/');
        } else {
            navigate('/auth');
        }
    }, [accessToken , isAuth]);

    return (
        <Flex className={styles.LoginLayout}>
            <h1>Вход</h1>
            <LoginForm />
        </Flex>
    );
};

export default LoginLayout;