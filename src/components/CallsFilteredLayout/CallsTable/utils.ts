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


// {
//     title: 'Чек-листы',
//     dataIndex: 'checklists',
//     key: 'checklists',
//     render: (checklists: string[], record: Call, index: number) => (
//         checklists.length === 1 ? (
//             <span className={styles.checklistItem}>{checklists[0]}</span>
//         ) : (
//             <Flex
//                 className={styles.manyItemsContainer}
//                 onClick={(e) => {
//                     e.stopPropagation();
//                     setVisibleChecklistIndex(visibleChecklistIndex === index ? null : index);
//                     setVisibleMarkerslistIndex(null);
//                 }}
//                 style={{ cursor: 'pointer', position: 'relative' }}
//             >
//                 <span className={styles.checklistItemLength}>{`${checklists.length}`}</span>
//                 {visibleChecklistIndex === index && (
//                     <Flex className={styles.manyItemsContainerModal}>
//                         {checklists.map((item, i) => (
//                             <span className={styles.checklistItem} key={i}>{item}</span>
//                         ))}
//                     </Flex>
//                 )}
//             </Flex>
//         )
//     )
// },
// {
//     title: 'Маркеры',
//     dataIndex: 'markers',
//     key: 'markers',
//     render: (markers: Array<{ value: string; label: string }>, record: Call, index: number) => (
//         markers.length === 1 ? (
//             <Tag className={`${styles.tag} ${styles[markers[0].value]}`}>
//                 {markers[0].label}
//             </Tag>
//         ) : (
//             <Flex
//                 className={styles.manyItemsContainer}
//                 onClick={(e) => {
//                     e.stopPropagation();
//                     setVisibleMarkerslistIndex(visibleMarkerslistIndex === index ? null : index);
//                     setVisibleChecklistIndex(null);
//                 }}
//                 style={{ cursor: 'pointer', position: 'relative' }}
//             >
//                 <span className={styles.markerItemLength}>{`${markers.length}`}</span>
//                 {visibleMarkerslistIndex === index && (
//                     <Flex className={styles.manyItemsContainerModal}>
//                         {markers.map((marker, i) => (
//                             <Tag
//                                 className={`${styles.tag} ${styles[marker.value]}`}
//                                 key={marker.value}
//                             >
//                                 {marker.label}
//                             </Tag>
//                         ))}
//                     </Flex>
//                 )}
//             </Flex>
//         )
//     )
// }