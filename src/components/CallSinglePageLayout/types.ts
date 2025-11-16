export interface CheckListItem {
    type: string;
    percent: string;
    checkListCompleting: number;
}


export interface MarkerItem {
    type: string;
    count :number;
}

export interface MarkerModalProps {
    position: { x: number; y: number } | null;
    onClose: () => void;
    item: MarkerItem | null;
}


export interface ModalState<T = any> {
    show: boolean;
    position: { x: number; y: number };
    item: T | null;
}

// types.ts
export interface CheckListModalState {
    show: boolean;
    position: { x: number; y: number } | null;  // добавить null
    item: CheckListItem | null;
}

export interface MarkerModalState {
    show: boolean;
    position: { x: number; y: number } | null;  // добавить null
    item: MarkerItem | null;
}

export interface TranscribationItem {
    type: 'operator' | 'customer';
    time: string;
    text: string;
    words: Word[];
}

export interface Word {
    word: string;
    endTime: string;
    startTime: string;
    confidence: number;
}

export interface Alternative {
    text: string;
    words: Word[];
    confidence: number;
}

export interface TranscribationChunk {
    channelTag: string;
    alternatives: Alternative[];
}

export interface TextTranscribationWidgetProps {
    // data?: TranscribationItem[];
}