import React, {useEffect, useRef, useState} from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import BaseSelect from "../../ui/BaseSelect/BaseSelect";
import PlayIcon from "../icons/PlayIcon";
import WaveSurfer from 'wavesurfer.js';
import {controlsOptions, getFormattedTime} from "../utils";
import cn from "classnames";
import {useCallsStore} from "../../../stores/callsStore";

interface AudioPlayerProps {
    showChannels: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({showChannels}) => {
    const [speed, setSpeed] = useState('0.75');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurfer = useRef<WaveSurfer | null>(null);

    const currentCallInfo = useCallsStore((state) => state.currentCallInfo);

    useEffect(() => {
        if (!currentCallInfo?.file_path) return;

        const audioUrl = `https://api.evrika360.com${currentCallInfo.file_path}`;
        const containerId = `waveform-${currentCallInfo.call_id}`;

        if (waveformRef.current) {
            waveformRef.current.id = containerId;

            wavesurfer.current = WaveSurfer.create({
                container: `#${containerId}`,
                height: 30,
                barWidth: 1,
                waveColor: '#E5E5E5',
                progressColor: 'rgba(0, 0, 0, 0.45)',
                cursorColor: 'transparent',
                normalize: true,
                plugins: [],
            });

            wavesurfer.current.load(audioUrl);
            wavesurfer.current.setPlaybackRate(parseFloat(speed));

            wavesurfer.current.on('ready', () => {
                const currentDuration = wavesurfer.current?.getDuration() || 0;
                setDuration(currentDuration);
            });

            wavesurfer.current.on('audioprocess', () => {
                setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
            });

            wavesurfer.current.on('finish', () => {
                setIsPlaying(false);
            });
        }

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
                wavesurfer.current = null;
            }
        };
    }, [currentCallInfo]);

    useEffect(() => {
        if (wavesurfer.current) {
            const speedValue = parseFloat(speed);
            wavesurfer.current.setPlaybackRate(speedValue);
        }
    }, [speed]);

    const togglePlay = () => {
        if (!wavesurfer.current) return;

        const newIsPlaying = !isPlaying;
        setIsPlaying(newIsPlaying);

        newIsPlaying ? wavesurfer.current.play() : wavesurfer.current.pause();
    };

    const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!wavesurfer.current || !duration) return;

        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        const seekTime = (event.clientX - rect.left) / target.offsetWidth * duration;

        wavesurfer.current.seekTo(seekTime / duration);
        setCurrentTime(seekTime);

        if (!isPlaying) {
            setIsPlaying(true);
            wavesurfer.current.play();
        }
    };

    if (!currentCallInfo?.file_path) {
        return <div className={styles.AudioPlayer}>Аудиофайл не найден</div>;
    }

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
                <div
                    className={styles.AudioPlayerWave}
                    onClick={handleSeek}
                    ref={waveformRef}
                >
                    {/* Контейнер для waveform будет создан автоматически */}
                </div>
                <div className={styles.AudioPlayerDuration}>
                    {getFormattedTime(currentTime)} / {getFormattedTime(duration)}
                </div>
            </div>

            {/* Закомментированная обработка второго канала */}
            {/*
            {audios[1] &&
                <div className={cn(styles.AudioPlayerRow, {
                    [styles.open]: showChannels,
                    [styles.hidden]: !showChannels
                })}>
                    <div className={styles.AudioPlayerRowCustomer}>
                        Клиент
                    </div>
                    <div className={styles.AudioPlayerWave}>
                        <div className='wave-cont' id={`waveform-${audios[1].id}`}></div>
                    </div>
                    <div className={styles.AudioPlayerEmpty}></div>
                </div>
            }
            */}
        </div>
    );
};

export default AudioPlayer;