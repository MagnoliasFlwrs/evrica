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