export const formatDate = (
    dateString: string,
    format: 'full' | 'date-only' | 'time-only' = 'full'
): string => {

    const isoString = dateString.replace(' ', 'T');
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Неверная дата';
    }

    if (format === 'date-only') {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'Europe/Moscow'
        };
        const formatted = date.toLocaleString('ru-RU', options);
        return formatted.replace(', г.', '').replace(' г.', '');
    }

    if (format === 'time-only') {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Europe/Moscow'
        };
        const time = date.toLocaleString('ru-RU', options);
        return time;
    }

    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Moscow'
    };
    const formattedDate = date.toLocaleString('ru-RU', options);
    const cleanedDate = formattedDate.replace(', г.', '').replace(' г.', '');
    return cleanedDate;
};