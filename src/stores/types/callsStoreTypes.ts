export interface CallTime {
    to: string | null;
    from: string | null;
}

export interface Filters {
    call_types: [];
    employees: [];
    clients: [];
    call_is_checked_statuses: [];
    checklist_statuses: [];
    call_time: CallTime;
    call_time_outs: CallTime;
    checklist_score_vector: string | null;
    checklist_score_vector_value: string | null;
    client_phone: string | null;
    worked_dictionaries: [];
}

export interface CategoryCallsListObj {
    filters: Filters;
    category_id: string | number | null;
    page: number;
    per_page: number;
}
export interface CheckListsByIdObj {
    category_id: string | number | null;
    date_start: number;
    date_end: number;
}


export interface DictionariesSearch {
    system: any[];
    client: any[];
}

export interface ChecklistsSearch {

}

export interface Call {
    id: number;
    call_id_user: string;
    call_type: string;
    is_missed: number;
    category_id: number;
    phone_number: string;
    phone_number_short: string;
    subject_name: string | null;
    call_duration: string;
    wait_duration: string | null;
    created_at: string;
    update_at: string;
    date_call: string;
    additional_field_1: string | null;
    additional_field_2: string | null;
    additional_field_3: string | null;
    additional_field_4: string | null;
    additional_field_5: string | null;
    call_infos: CallInfo[];
    dictionaries_score_positive: number;
    dictionaries_score_negative: number;
    dictionaries_count: number;
    checklists_percent_average: number;
    checklists_count: number;
}

export interface CallsData {
    calls: Call[];
    unique_phone_numbers: number;
}

export interface Paginator {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
}

export interface CallsByCategory {
    data: CallsData;
    paginator: Paginator;
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

export interface Chunk {
    channelTag: string;
    alternatives: Alternative[];
}

export interface RecognitionResponse {
    "@type": string;
    chunks: Chunk[];
}

export interface JsonData {
    id: string;
    done: boolean;
    response: RecognitionResponse;
    createdAt: string;
    createdBy: string;
    modifiedAt: string;
}

export interface CallInfo {
    id: number;
    call_id: number;
    recognition_id: string;
    id_at_the_client: string;
    agent_name: string;
    extension_number: string;
    file_name: string;
    file_name_base64: string;
    bitrate_origin: string | null;
    chanel_count: number;
    file_path: string;
    reverse: number;
    status_audio_id: number;
    date_converted: string;
    date_send_to_recognition: string;
    date_recognition: string;
    json_path: string | null;
    phone_transactions: string | null;
    json: JsonData;
    json_text: string;
    text_channel_1: string;
    text_channel_2: string;
    wait_time: string | null;
    hold_time: string | null;
    max_pause: string | null;
    ring_time: string;
    in_docker: number;
    created_at: string;
    update_at: string;
    audio_file_duration: number;
    recognition_uuid: string;
    checked_status: string | null;
    comment: string | null;
    checked_for_tariff: number;
    average_audio_file_duration: number | null;
    external_link: string | null;
    is_transfered: number;
    receiving_type: string | null;
    deal_id: string | null;
    activity_id: string | null;
    crm_stage: string | null;
    dictionaries_search: DictionariesSearch;
    checklists_search: ChecklistsSearch[];
    call: Call;
}

export interface CurrentCallInfo {
    id: number;
    call_id: number;
    recognition_id: string;
    id_at_the_client: string;
    agent_name: string;
    extension_number: string;
    file_name: string;
    file_name_base64: string;
    bitrate_origin: string | null;
    chanel_count: number;
    file_path: string;
    reverse: number;
    status_audio_id: number;
    date_converted: string;
    date_send_to_recognition: string;
    date_recognition: string;
    json_path: string | null;
    phone_transactions: string | null;
    json: JsonData;
    json_text: string;
    text_channel_1: string;
    text_channel_2: string;
    wait_time: string | null;
    hold_time: string | null;
    max_pause: string | null;
    ring_time: string;
    in_docker: number;
    created_at: string;
    update_at: string;
    audio_file_duration: number;
    recognition_uuid: string;
    checked_status: string | null;
    comment: string | null;
    checked_for_tariff: number;
    average_audio_file_duration: number | null;
    external_link: string | null;
    is_transfered: number;
    receiving_type: string | null;
    deal_id: string | null;
    activity_id: string | null;
    crm_stage: string | null;
    dictionaries_search: DictionariesSearch;
    checklists_search: ChecklistsSearch[];
    call: Call;
}

export interface CallsState {
    error: boolean;
    loading: boolean;
    pendingCalls: [];
    callsCategories: [];
    checkListsByIdList: [];
    currentCallInfo: CurrentCallInfo | null; // Изменено с [] на CurrentCallInfo | null
    checkListsByIdObj: CheckListsByIdObj;
    callsByCategory: CallsByCategory | null;
    currentCallId: string | null | number;
    categoryCallsListObj: CategoryCallsListObj;
    setError: (value: boolean) => void;
    getPendingCalls: () => Promise<any>;
    getCallsCategories: () => Promise<any>;
    getCallsByCategoryId: () => Promise<any>;
    getChecklistsByCategoryId: () => Promise<any>;
    setCategoryId: (id: number | string) => void;
    setCategoryCallsListObjPerPage: (count: number) => void;
    setCategoryCallsListObjPage: (page: number) => void;
    setCurrentCallId: (id: string | null | number) => void;
    getCurrentCallInfo: (id: string | null | number) => Promise<CurrentCallInfo>; // Обновлен возвращаемый тип
}