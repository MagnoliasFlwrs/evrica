import {TableRecord} from "./CallsTable";

export const formatDate = (
    timestamp: string,
    format: 'full' | 'date-only' | 'time-only' = 'full'
): string => {
    const date = new Date(Number(timestamp) * 1000);

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
        return `${time} (GMT+3)`;
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
    return `${cleanedDate} (GMT+3)`;
};


export const data: TableRecord[] = Array.from({ length: 100 }, (_, index) => {
    const id = (1000 + index).toString();
    const callTypes = ['Входящий', 'Исходящий', 'Пропущенный'];
    const durations = ['00:05', '00:12', '00:23', '01:45', '02:30', '03:15', '04:02', '05:48'];
    const phones = ['375290000000', '375290000001', '375290000002', '375290000003', '375290000004'];
    const userNames = ['евлампий', 'алексей', 'мария', 'анна', 'дмитрий', 'екатерина', 'сергей', 'ольга'];
    const checklistOptions = ['hr', 'sales', 'support', 'technical', 'quality'];
    const markerOptions = ['не хочу', 'не буду', 'перезвонить', 'важно', 'срочно', 'обработано', 'проблема'];

    const randomCallType = callTypes[Math.floor(Math.random() * callTypes.length)];
    const randomDuration = durations[Math.floor(Math.random() * durations.length)];
    const randomPhone = phones[Math.floor(Math.random() * phones.length)];
    const randomUserName = userNames[Math.floor(Math.random() * userNames.length)];

    const randomTimestamp = (Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 2592000)).toString();


    const randomChecklists = Array.from(
        { length: Math.floor(Math.random() * 4) + 1 },
        () => checklistOptions[Math.floor(Math.random() * checklistOptions.length)]
    ).filter((value, index, self) => self.indexOf(value) === index);


    const randomMarkers = Array.from(
        { length: Math.floor(Math.random() * 4) + 1 },
        () => markerOptions[Math.floor(Math.random() * markerOptions.length)]
    ).filter((value, index, self) => self.indexOf(value) === index);

    return {
        key: (index + 1).toString(),
        id: id,
        callType: randomCallType,
        date: randomTimestamp,
        duration: randomDuration,
        phone: randomPhone,
        userName: randomUserName,
        checklists: randomChecklists,
        markers: randomMarkers
    };
});