import {callsOptionsCheckListColors, callsOptionsMarkersColors} from "../CallsFilteredLayout/CallsOptions/utils";
import {MarkerItem} from "./types";

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

