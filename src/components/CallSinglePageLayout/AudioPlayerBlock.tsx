import React, {useState} from 'react';
import styles from './CallSinglePageLayout.module.scss'
import OutlinedButton from "../ui/OutlinedButton/OutlinedButton";
import EyeIcon from "./icons/EyeIcon";
import ClosedEyeIcon from "./icons/ClosedEyeIcon";
import DownloadIcon from "../icons/DownloadIcon";
import BlueCircledIcon from "../ui/BlueCircledIcon/BlueCircledIcon";
import AudioPlayer from "./AudioPlayer/AudioPlayer";

const AudioPlayerBlock = () => {
    const [isHideSpeechStages, setHideSpeechStages] = useState(false);
    const [showChannels, setShowChannels] = useState(false);


    return (
        <div className={styles.AudioPlayerBlock}>
            <div className={styles.AudioPlayerBlockHead}>
                <p>Аудиозапись</p>
                <div className={styles.AudioPlayerBlockHeadBtns}>
                    <OutlinedButton
                        icon={isHideSpeechStages ? <ClosedEyeIcon/> : <EyeIcon/>}
                        text={isHideSpeechStages ? 'Скрыть этапы разговора': 'Показать этапы разговора'}
                        onClick={() => {setHideSpeechStages(!isHideSpeechStages)}}
                    />
                    <OutlinedButton
                        icon={showChannels ? <EyeIcon/> : <ClosedEyeIcon/> }
                        text={showChannels ? 'Скрыть каналы' : 'Показать каналы'}
                        onClick={() => {setShowChannels(!showChannels)}}
                    />
                    <BlueCircledIcon icon={<DownloadIcon />}/>
                </div>
            </div>
            <AudioPlayer showChannels={showChannels}/>
        </div>
    );
};

export default AudioPlayerBlock;