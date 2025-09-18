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