import React, {useState, useRef, useMemo} from 'react';
import {Flex} from "antd";
import styles from './ClientInfoModal.module.scss'
import CloseIcon from "../../ui/CustomSelect/icons/CloseIcon";
import BlueArrow from "../../icons/BlueArrow";
import CustomTextModal from "../../ui/CustomTextModal/CustomTextModal";
import {useCallsStore} from "../../../stores/callsStore";
import {flattenClientData, getBaseSystemResult} from "../aiJsonBaseSystem";

interface ClientInfoModalProps {
    setOpenClientInfoModal:(value:boolean)=>void;
}

const ClientInfoModal:React.FC<ClientInfoModalProps> = ({setOpenClientInfoModal}) => {
    const [openAgeModal , setOpenAgeModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const aiJsonList = useCallsStore((state) => state.aiJsonList);

    const client = useMemo(() => {
        const base = getBaseSystemResult(aiJsonList);
        return flattenClientData(base);
    }, [aiJsonList]);

    const rel = client.информация_о_близких;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setOpenClientInfoModal(false);
        }
    };

    return (
        <Flex className={styles.ClientInfoModalContainer} onClick={handleOverlayClick}>
            <Flex
                className={styles.ClientInfoModal}
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
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
                            <span>{client.имя ?? '-'}</span>
                        </li>
                        <li>
                            <p>Пол</p>
                            <span>{client.пол ?? '-'}</span>
                        </li>
                        <li>
                            <p>Возраст</p>
                            <span>
                                {client.возраст ?? '-'}
                                <button
                                    onMouseEnter={() => setOpenAgeModal(true)}
                                    onMouseLeave={() => setOpenAgeModal(false)}
                                >
                                    <BlueArrow/>
                                </button>
                                {
                                    openAgeModal &&
                                    <CustomTextModal
                                        content={
                                            <Flex>
                                                <p>Причина оценки возраста</p>
                                                <p>{client.причина_оценки_возраста ?? '-'}</p>
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
                            <span>{client.должность ?? '-'}</span>
                        </li>
                        <li>
                            <p>Место работы</p>
                            <span>{client.место_работы ?? '-'}</span>
                        </li>
                        <li>
                            <p>Сфера деятельности</p>
                            <span>{client.сфера_деятельности ?? '-'}</span>
                        </li>
                        <li>
                            <p>Хобби и интересы</p>
                            <span>{client.хобби_и_интересы ?? '-'}</span>
                        </li>
                        <li>
                            <p>Семейное положение</p>
                            <span>{client.семейное_положение ?? '-'}</span>
                        </li>
                        <li>
                            <p>Наличие детей</p>
                            <span>{client.наличие_детей ?? '-'}</span>
                        </li>
                        <li>
                            <p>Место проживания</p>
                            <span>{client.где_живет_клиент ?? '-'}</span>
                        </li>
                    </ul>
                    <ul className={styles.ClientInfoModalInfoCard}>
                        <p className="title">Информация о близких</p>
                        <li>
                            <p>Имя</p>
                            <span>{rel?.имя ?? '-'}</span>
                        </li>
                        <li>
                            <p>Возраст</p>
                            <span>{rel?.возраст ?? '-'}</span>
                        </li>
                        <li>
                            <p>Место работы</p>
                            <span>{rel?.место_работы ?? '-'}</span>
                        </li>
                        <li>
                            <p>Степень родства</p>
                            <span>{rel?.степень_родства ?? '-'}</span>
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
