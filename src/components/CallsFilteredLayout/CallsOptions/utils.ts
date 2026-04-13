export const hexToRgba = (hex: string, alpha: number): string | null => {
    const normalized = hex.trim();
    if (!normalized.startsWith('#')) return null;

    const value = normalized.slice(1);
    const isShort = value.length === 3;
    const isLong = value.length === 6;
    if (!isShort && !isLong) return null;

    const expanded = isShort
        ? value.split('').map((c) => `${c}${c}`).join('')
        : value;

    const r = parseInt(expanded.slice(0, 2), 16);
    const g = parseInt(expanded.slice(2, 4), 16);
    const b = parseInt(expanded.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const callsOptionsCheckListColors = {
    green: {
        color:'#00C310',
        bgColor: 'rgba(0, 195, 16, 0.20)',
    },
    orange: {
        color:'#F39600',
        bgColor: 'rgba(243, 150, 0, 0.20)',
    },
    gray: {
        color:'#C0C0C0',
        bgColor: 'rgba(192, 192, 192, 0.20)',
    }
}

export const callsOptionsMarkersColors = {
    green: {
        color:'#486A12',
        bgColor: '#EDFBCC',
    },
    blue: {
        color:'#00598F',
        bgColor: '#ECF8FE',
    },
    aqua: {
        color:'#126D69',
        bgColor: '#CCFBF0',
    },
    purple: {
        color:'#8D1697',
        bgColor: '#F9E7FE',
    }
}