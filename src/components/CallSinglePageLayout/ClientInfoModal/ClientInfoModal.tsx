import React, {useState, useRef, useEffect} from 'react';
import {Flex} from "antd";
import styles from './ClientInfoModal.module.scss'
import CloseIcon from "../../ui/CustomSelect/icons/CloseIcon";
import BlueArrow from "../../icons/BlueArrow";
import CustomTextModal from "../../ui/CustomTextModal/CustomTextModal";
import {useCallsStore} from "../../../stores/callsStore";
import {AiSystemAnswer} from "../../../stores/types/callsStoreTypes";

interface ClientInfoModalProps {
    setOpenClientInfoModal:(value:boolean)=>void;
}

const ClientInfoModal:React.FC<ClientInfoModalProps> = ({setOpenClientInfoModal}) => {
    const [openAgeModal , setOpenAgeModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const aiJsonList = useCallsStore((state) => state.aiJsonList);

    const [systemJsonList, setSystemJsonList] = useState<AiSystemAnswer[]>([]);

    useEffect(() => {
        if (aiJsonList && aiJsonList.length > 0) {
            const firstAiJson = aiJsonList[0];
            const filteredSystem = firstAiJson.answers.system.filter((item: AiSystemAnswer) =>
                item.name === 'БАЗОВЫЙ СИСТЕМНЫЙ'
            );
            setSystemJsonList(filteredSystem);
        }
    }, [aiJsonList]);
    const baseSystemData = systemJsonList[0]?.result;

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
                            <span>{baseSystemData?.данные_о_клиенте.имя}</span>
                        </li>
                        <li>
                            <p>Пол</p>
                            <span>{baseSystemData?.данные_о_клиенте.пол}</span>
                        </li>
                        <li>
                            <p>Возраст</p>
                            <span>
                                {baseSystemData?.данные_о_клиенте.возраст}
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
                                                <p>{baseSystemData?.данные_о_клиенте.причина_оценки_возраста}</p>
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
                            <span>{baseSystemData?.данные_о_клиенте?.должность}</span>
                        </li>
                        <li>
                            <p>Место работы</p>
                            <span>{baseSystemData?.данные_о_клиенте?.место_работы}</span>
                        </li>
                        <li>
                            <p>Сфера деятельности</p>
                            <span>{baseSystemData?.данные_о_клиенте?.сфера_деятельности}</span>
                        </li>
                        <li>
                            <p>Хобби и интересы</p>
                            <span>{baseSystemData?.данные_о_клиенте?.хобби_и_интересы}</span>
                        </li>
                        <li>
                            <p>Семейное положение</p>
                            <span>{baseSystemData?.данные_о_клиенте?.семейное_положение}</span>
                        </li>
                        <li>
                            <p>Наличие детей</p>
                            <span>{baseSystemData?.данные_о_клиенте?.наличие_детей}</span>
                        </li>
                        <li>
                            <p>Место проживания</p>
                            <span>{baseSystemData?.данные_о_клиенте?.где_живет_клиент}</span>
                        </li>
                    </ul>
                    <ul className={styles.ClientInfoModalInfoCard}>
                        <p className="title">Информация о близких</p>
                        <li>
                            <p>Имя</p>
                            <span>{baseSystemData?.данные_о_клиенте?.информация_о_близких?.имя}</span>
                        </li>
                        <li>
                            <p>Возраст</p>
                            <span>{baseSystemData?.данные_о_клиенте?.информация_о_близких?.возраст}</span>
                        </li>
                        <li>
                            <p>Место работы</p>
                            <span>{baseSystemData?.данные_о_клиенте?.информация_о_близких?.место_работы}</span>
                        </li>
                        <li>
                            <p>Степень родства</p>
                            <span>{baseSystemData?.данные_о_клиенте?.информация_о_близких?.степень_родства}</span>
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