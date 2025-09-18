import React, {useEffect, useRef, useState} from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import BaseSelect from "../../ui/BaseSelect/BaseSelect";
import PlayIcon from "../icons/PlayIcon";
import audio1 from './1.wav'
import audio2 from './2.wav'
import WaveSurfer from 'wavesurfer.js';
import {controlsOptions, getFormattedTime} from "../utils";

interface AudioPlayerProps {
    showChannels: boolean;
}

interface AudioItem {
    audio: string;
    id: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({showChannels}) => {
    const [speed, setSpeed] = useState('0.75');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const waveforms = useRef<HTMLDivElement[]>([]);
    const wavesurfers = useRef<WaveSurfer[]>([]);

    const audios: AudioItem[] = [
        {audio: audio1, id: 1},
        {audio: audio2, id: 2}
    ];

    useEffect(() => {
        wavesurfers.current = [];
        waveforms.current = [];

        const createWaveSurferInstance = (audio: AudioItem) => {
            const containerId = `waveform-${audio.id}`;
            const container = document.getElementById(containerId);

            if (!container) {
                return null;
            }

            const wavesurfer = WaveSurfer.create({
                container: container,
                height: 30,
                barWidth: 1,
                waveColor: '#E5E5E5',
                progressColor: 'rgba(0, 0, 0, 0.45)',
                cursorColor: 'transparent',
                normalize: true,
                plugins: [],
            });

            wavesurfer.load(audio.audio);
            wavesurfer.on('ready', () => {
                const currentDuration = wavesurfer.getDuration();
                setDuration(prevDuration => Math.max(prevDuration, currentDuration));
            });
            wavesurfer.on('audioprocess', () => {
                setCurrentTime(wavesurfer.getCurrentTime());
            });

            return wavesurfer;
        };

        const waveSurferInstances = audios.map(audio => createWaveSurferInstance(audio)).filter((instance): instance is WaveSurfer => instance !== null);

        wavesurfers.current = waveSurferInstances;

        return () => {
            waveSurferInstances.forEach((wavesurfer) => wavesurfer.destroy());
        };
    }, []);

    const togglePlay = () => {
        const newIsPlaying = !isPlaying;
        setIsPlaying(newIsPlaying);
        wavesurfers.current.forEach(wavesurfer => {
            newIsPlaying ? wavesurfer.play() : wavesurfer.pause();
        });
    };

    const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        const seekTime = event.nativeEvent.offsetX / target.offsetWidth * duration;
        wavesurfers.current.forEach(wavesurfer => {
            wavesurfer.seekTo(seekTime / wavesurfer.getDuration());
        });
        setCurrentTime(seekTime);
        setIsPlaying(true);
        wavesurfers.current.forEach(wavesurfer => {
            wavesurfer.play();
        });
    };

    return (
        <div className={styles.AudioPlayer}>
            <div className={styles.AudioPlayerRow}>
                <div className={styles.AudioPlayerRowControls}>
                    <BaseSelect
                        options={controlsOptions}
                        value={speed}
                        width='78px'
                        onChange={(value) => {
                            setSpeed(value);
                        }}
                        isHaveHeader={false}
                        isOutlined={true}
                    />
                    <button className={styles.PlayBtn} onClick={togglePlay}>
                        <PlayIcon/>
                    </button>
                </div>
                <div className={styles.AudioPlayerWave} onClick={handleSeek}>
                    <div className='wave-cont'  id={`waveform-${audios[0].id}`}></div>
                </div>
                <div className={styles.AudioPlayerDuration}>
                    {getFormattedTime(currentTime)} / {getFormattedTime(duration)}
                </div>
            </div>
            {
                showChannels &&
                <div className={styles.AudioPlayerRow}>
                    <div className={styles.AudioPlayerRowCustomer}>
                        Клиент
                    </div>
                    <div className={styles.AudioPlayerWave}>
                        <div className='wave-cont' id={`waveform-${audios[1].id}`}></div>
                    </div>
                    <div className={styles.AudioPlayerEmpty}></div>
                </div>
            }

        </div>
    );
};

export default AudioPlayer;