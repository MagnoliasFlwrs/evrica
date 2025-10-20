import React, {useState, FormEvent, useEffect} from 'react';
import {Checkbox, Flex, CheckboxChangeEvent, notification} from "antd";
import styles from './LoginLayout.module.scss'
import ClosedEyeIcon from "../CallSinglePageLayout/icons/ClosedEyeIcon";
import EyeIcon from "../CallSinglePageLayout/icons/EyeIcon";
import {useAuth} from "../../store";

interface FormData {
    login: string;
    password: string;
    remember: boolean;
}

interface FormErrors {
    login?: string;
    password?: string;
}

const LoginForm = () => {
    const [isVisiblePassword, setIsVisiblePassword] = useState(false);
    const authUser = useAuth((state)=> state.authUser);
    const error = useAuth((state)=> state.error);
    const setError = useAuth((state)=> state.setError);
    const [formData, setFormData] = useState<FormData>({
        login: '',
        password: '',
        remember: false
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [api, contextHolder] = notification.useNotification();

    const handleNotificationClose =()=> {
        setFormData({
            login: '',
            password: '',
            remember: false
        })
        setError(false)
    }

    const openNotificationWithIcon = () => {
        api['error']({
            message: 'Ошибка!',
            description: 'Неправильный логин или пароль!',
            onClose: () => handleNotificationClose()
        });
    };

    useEffect(() => {
        if (error) {
            openNotificationWithIcon();
        }
    }, [error])

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const checked = e.target.checked;
        console.log(`checked = ${checked}`);
        setFormData(prev => ({
            ...prev,
            remember: checked
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));


        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const togglePasswordVisibility = () => {
        setIsVisiblePassword(prev => !prev);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.login.trim()) {
            newErrors.login = 'Логин обязателен для заполнения';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Пароль обязателен для заполнения';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Данные формы:', formData);
            authUser(formData)
        }
    };

    return (
        <Flex className={styles.LoginFormContainer}>
            {contextHolder}
            <Flex className={styles.LoginForm} component="form" onSubmit={handleSubmit}>
                <Flex className={styles.LoginFormRow}>
                    <span className={styles.LoginFormRowLabel}>Логин</span>
                    <input
                        type="text"
                        name="login"
                        value={formData.login}
                        onChange={handleInputChange}
                    />
                    {errors.login && (
                        <span className={styles.LoginFormRowError}>{errors.login}</span>
                    )}
                </Flex>
                <Flex className={styles.LoginFormRow}>
                    <span className={styles.LoginFormRowLabel}>Пароль</span>
                    <Flex className={styles.LoginFormRowPassword}>
                        <input
                            type={isVisiblePassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <span
                            className={styles.visibilityBtn}
                            onClick={togglePasswordVisibility}
                            style={{ cursor: 'pointer' }}
                        >
                            {isVisiblePassword ? <EyeIcon /> : <ClosedEyeIcon />}
                        </span>
                    </Flex>
                    {errors.password && (
                        <span className={styles.LoginFormRowError}>{errors.password}</span>
                    )}
                </Flex>
                <Checkbox
                    name="remember"
                    checked={formData.remember}
                    onChange={handleCheckboxChange}
                    className={styles.CustomCheckbox}
                >
                    Запомнить меня
                </Checkbox>
                <button type="submit">
                    Войти
                </button>
                <p className={styles.rememberPass}>Забыли пароль? <a href="#">Восстановить</a></p>
            </Flex>
        </Flex>
    );
};

export default LoginForm;