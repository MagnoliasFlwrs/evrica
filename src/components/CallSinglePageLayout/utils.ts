import {callsOptionsCheckListColors} from "../CallsFilteredLayout/CallsOptions/utils";
import {TranscribationChunk, TranscribationItem} from "./types";

export const getFormattedTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

export const controlsOptions = [
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
];

export const getColorByPercent = (percent: string) => {
    const percentNumber = parseInt(percent.replace('%', ''), 10);
    if (percentNumber > 85) {
        return callsOptionsCheckListColors.green;
    } else if (percentNumber > 50) {
        return callsOptionsCheckListColors.orange;
    } else {
        return callsOptionsCheckListColors.gray;
    }
};

export const formatDateTime = (dateString: string): string => {
    const months = [
        'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
        'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
    ];

    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
};

export const formatSecondsToTimeWithHours = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
    ].join(':');
};


export const generateTranscribationTXT = (
    transcribationData: TranscribationItem[],
    callId?: string | null | number
): void => {
    let textContent = `ТРАНСКРИБАЦИЯ РАЗГОВОРА${callId ? ` #${callId}` : ''}\n`;
    textContent += `Сгенерировано: ${new Date().toLocaleString('ru-RU')}\n\n`;
    textContent += '='.repeat(50) + '\n\n';

    transcribationData.forEach(item => {
        const speaker = item.type === 'operator' ? 'ОПЕРАТОР' : 'КЛИЕНТ';
        textContent += `[${item.time}] ${speaker}:\n`;
        textContent += `${item.text}\n\n`;
        textContent += '-'.repeat(30) + '\n\n';
    });

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const fileName = `транскрибация_${callId || new Date().getTime()}.txt`;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const copyTranscribationToClipboard = (transcribationData: TranscribationItem[]): Promise<void> => {
    const fullText = transcribationData
        .map(item => {
            const speaker = item.type === 'operator' ? 'Оператор' : 'Клиент';
            return `[${item.time}] ${speaker}: ${item.text}`;
        })
        .join('\n\n');

    return navigator.clipboard.writeText(fullText);
};

export const formatTime = (timeString: string): string => {
    const seconds = parseFloat(timeString.replace('s', ''));
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getTimeFromChunk = (chunk: TranscribationChunk): string => {
    if (chunk.alternatives?.[0]?.words?.[0]?.startTime) {
        return formatTime(chunk.alternatives[0].words[0].startTime);
    }
    return '00:00';
};
