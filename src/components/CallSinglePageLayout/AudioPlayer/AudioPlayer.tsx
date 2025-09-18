import React, {useState} from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import BaseSelect from "../../ui/BaseSelect/BaseSelect";
import PlayIcon from "../icons/PlayIcon";


interface AudioPlayerProps {
    showChannels: boolean;
}

const AudioPlayer:React.FC<AudioPlayerProps> = ({showChannels}) => {
    const [speed, setSpeed] = useState('0.75');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const controlsOptions = [
        {
            value: '0.5',
            label: 'x0.5'
        },
        {
            value: '0.75',
            label: 'x0.75'
        },
        {
            value: '1',
            label: 'x1'
        },
    ]
    return (
        <div className={styles.AudioPlayer}>
            <div className={styles.AudioPlayerRow}>
                <div className={styles.AudioPlayerRowControls}>
                    <BaseSelect
                        options={controlsOptions}
                        value={speed}
                        width='78px'
                        onChange={(value) => {setSpeed(value)}}
                        isHaveHeader={false}
                        isOutlined={true}
                    />
                    <button className={styles.PlayBtn} onClick={() => {setIsPlaying(!isPlaying)}}>
                        <PlayIcon/>
                    </button>
                </div>
                <div className={styles.AudioPlayerWave}>

                </div>
                <div className={styles.AudioPlayerDuration}>
                    00:02:12 / 00:11:15
                </div>
            </div>
            {
                showChannels &&
                <div className={styles.AudioPlayerRow}>
                    <div className={styles.AudioPlayerRowCustomer}>
                        Клиент
                    </div>
                    <div className={styles.AudioPlayerWave}>

                    </div>
                    <div className={styles.AudioPlayerEmpty}>

                    </div>
                </div>

            }

        </div>
    );
};

export default AudioPlayer;