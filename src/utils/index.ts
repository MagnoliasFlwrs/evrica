export const toFirstUpperCase = (str: string | undefined): string => {
  if (!str) return '';

  return str[0].toUpperCase() + str.slice(1);
};

export const formatCallDate = (value?: string) => {
  if (!value) return 'не определено';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTimelineDate = (value?: string) => {
  if (!value) return '--.--';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '--.--';
  return parsed.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
};
