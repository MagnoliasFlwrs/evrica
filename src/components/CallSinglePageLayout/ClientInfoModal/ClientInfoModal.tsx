import React, {useState, useRef} from 'react';
import {Flex} from "antd";
import styles from './ClientInfoModal.module.scss'
import CloseIcon from "../../ui/CustomSelect/icons/CloseIcon";
import BlueArrow from "../../icons/BlueArrow";
import CustomTextModal from "../../ui/CustomTextModal/CustomTextModal";

interface ClientInfoModalProps {
    setOpenClientInfoModal:(value:boolean)=>void;
}

const ClientInfoModal:React.FC<ClientInfoModalProps> = ({setOpenClientInfoModal}) => {
    const [openAgeModal , setOpenAgeModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Проверяем, что клик был именно по контейнеру, а не по модалке
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setOpenClientInfoModal(false);
        }
    };

    return (
        <Flex className={styles.ClientInfoModalContainer} onClick={handleOverlayClick}>
            <Flex
                className={styles.ClientInfoModal}
                ref={modalRef}
                onClick={(e) => e.stopPropagation()} // Предотвращаем всплытие клика
            >
                <Flex className={styles.ClientInfoModalHead}>
                    <p>Информация по клиенту</p>
                    <button onClick={()=>setOpenClientInfoModal(false)}>
                        <CloseIcon/>
                    </button>
                </Flex>
                <Flex className={styles.ClientInfoModalInfoCards}>
                    <ul className={styles.ClientInfoModalInfoCard}>
                        <p className="title">Данные о клиенте</p>
                        <li>
                            <p>Имя</p>
                            <span>Иван</span>
                        </li>
                        <li>
                            <p>Пол</p>
                            <span>Мужчина</span>
                        </li>
                        <li>
                            <p>Возраст</p>
                            <span>
                                25 - 30 лет
                                <button onClick={() => setOpenAgeModal(true)}>
                                    <BlueArrow/>
                                </button>
                                {
                                    openAgeModal &&
                                    <CustomTextModal
                                        content={
                                            <Flex>
                                                <p>Причина оценки возраста</p>
                                                <p>Упоминание о семье и желание купить автомобиль</p>
                                            </Flex>
                                        }
                                        top={true}
                                        right={true}
                                        onClick={()=>setOpenAgeModal(false)}
                                    />
                                }

                            </span>
                        </li>
                        <li>
                            <p>Должность</p>
                            <span>-</span>
                        </li>
                        <li>
                            <p>Место работы</p>
                            <span>-</span>
                        </li>
                        <li>
                            <p>Сфера деятельности</p>
                            <span>-</span>
                        </li>
                        <li>
                            <p>Хобби и интересы</p>
                            <span>-</span>
                        </li>
                        <li>
                            <p>Семейное положение</p>
                            <span>Женат</span>
                        </li>
                        <li>
                            <p>Наличие детей</p>
                            <span>-</span>
                        </li>
                        <li>
                            <p>Место проживания</p>
                            <span>Москва</span>
                        </li>
                    </ul>
                    <ul className={styles.ClientInfoModalInfoCard}>
                        <p className="title">Информация о близких</p>
                        <li>
                            <p>Имя</p>
                            <span>-</span>
                        </li>
                        <li>
                            <p>Возраст</p>
                            <span>-</span>
                        </li>
                        <li>
                            <p>Место работы</p>
                            <span>-</span>
                        </li>
                        <li>
                            <p>Степень родства</p>
                            <span>-</span>
                        </li>

                    </ul>
                </Flex>
                <a href="#">
                    Перейти в карточку клиента
                    <button> <BlueArrow/></button>
                </a>
            </Flex>
        </Flex>
    );
};
export default ClientInfoModal;