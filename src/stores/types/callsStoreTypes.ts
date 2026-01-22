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
    filters?: Filters;
    category_id: string | number | null;
    page: number;
    per_page: number;
    date_start: null | number;
    date_end:null | number;
}
export interface CheckListsByIdObj {
    category_id: string | number | null;
    date_start: number | null;
    date_end: number | null;
}

export interface ChecklistsSearch {
    id: number;
    category_id: number;
    checklist_id: number;
    limit_result: number;
    color_success: string | null;
    color_reject: string | null;
    reverse: number;
    unique_result: number;
    date_start: string | null;
    date_stop: string | null;
    search_in_call: number;
    search_out_call: number;
    checklist: {
        id: number;
        name: string;
        limit_result: number;
        color_success: string | null;
        color_reject: string | null;
        date_start: string | null;
        date_stop: string | null;
        search_in_call: number;
        search_out_call: number;
        dictionaries: {
            system: any[];
            client: any[];
        };
        found_count_by_period: {
            all: any;
        };
    };
    relevant: boolean;
    successfully: any[];
    unsuccessfully: any[];
    average: any[];
}

export interface DictionariesSearch {
    system: any[];
    client: any[];
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
export interface PromptItem {
    id: number;
    question_label: string;
    org_id: number | null;
    category_id: number | null;
    question_types: string;
}

export type PromptList = PromptItem[];

export interface AiJsonList {
    id: number;
    answers: {
        custom: any[];
        system: AiSystemAnswer[];
    };
}

export interface AiSystemAnswer {
    name: string;
    result: {
        рекомендации: {
            маркетинг: Recommendation;
            операционный_бизнес: Recommendation;
            качество_обслуживания: Recommendation;
        };
        данные_о_клиенте: ClientData;
        информация_по_звонку: CallInfo;
        информация_по_менеджеру: ManagerInfo;
        удовлетворенность_клиента: CustomerSatisfaction;
        классификация_инсайтов_клиента: CustomerInsights;
    };
}

export interface Recommendation {
    действие: string;
    приоритет: string;
}

export interface ClientData {
    имя: string;
    пол: string;
    возраст: string;
    должность: string;
    место_работы: string;
    наличие_детей: string;
    где_живет_клиент: string;
    хобби_и_интересы: string;
    семейное_положение: string;
    сфера_деятельности: string;
    информация_о_близких: RelativeInfo;
    причина_оценки_возраста: string;
}

export interface RelativeInfo {
    имя: string;
    возраст: string;
    место_работы: string;
    степень_родства: string;
}

export interface CallInfo {
    суть_звонка: string;
    инициатор_тем: string;
    первичный_трафик: string;
    какой_следующий_шаг: string;
    выявленная_проблема: string;
    кто_управляет_беседой: string;
    статус_решения_проблемы: string;
    дата_следующего_контакта: string;
    чем_интересовался_клиент: string;
    качество_проработки_звонка: string;
    требует_ли_прослушивания_руководством: string;
    объяснение_ответа_даты_следующего_контакта: string;
    комментарий_по_необходимости_прослушивания_руководством: string[];
    "требует_звонок_незамедлительного_внимания (проблемный звонок)": {
        да_или_нет: string;
        объяснение: string;
    };
}

export interface ManagerInfo {
    что_должен_сделать_менеджер: string;
}

export interface CustomerSatisfaction {
    рекомендации: string[];
    начальная_оценка: SatisfactionScore;
    окончательная_оценка: SatisfactionScore;
    сравнение_удовлетворенности: string;
}

export interface SatisfactionScore {
    балл: string;
    причина: string;
}

export interface CustomerInsights {
    боли: InsightCategory;
    интересы: InsightCategory;
    потребности: InsightCategory;
}

export interface InsightCategory {
    тип: string;
    категории: string[];
    упоминания: number;
    интенсивность: number;
}

export interface Dictionary {
    id: number;
    name: string;
    description: string | null;
    query: string;
    reverse: number;
    negative_weight: number | null;
    positive_weight: number | null;
    color_success: string | null;
    color_reject: string | null;
    color_not_exist?: string | null;
    search_in_channel_1: number;
    search_in_channel_2: number;
    search_in_call: number;
    search_out_call: number;
    is_valid: number;
    updated_at: string | null;
    who_updated: number | null;
    in_dashboard?: number | null;
    from_system_dictionary?: number | null;
    found: any[];
    found_count_by_period: {
        day: any[];
        month: any[];
        all: any[];
    };
    loaded_period_data: boolean;
    worked_call_infos: any[];
}

export interface CategoryDictionary {
    id: number;
    category_id: number;
    dictionary_id: number;
    dictionary_type: "system" | "client";
    positive_weight: number;
    negative_weight: number;
    color_success: string | null;
    color_reject: string | null;
    reverse: number;
    who_delete: number | null;
    channel: number | null;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
    search_in_call: number;
    search_out_call: number;
    dictionary: Dictionary;
}


export interface CategoriesDictionariesList {
    system: CategoryDictionary[];
    client: CategoryDictionary[];
}
export interface CallsState {
    error: boolean;
    loading: boolean;
    pendingCalls: [];
    callsCategories: [];
    checkListsByIdList: [];
    dictionariesByIdList: [];
    promptList: PromptList;
    aiJsonList: AiJsonList[]; // Теперь правильно типизирован
    currentCallInfo: CurrentCallInfo | null;
    checkListsByIdObj: CheckListsByIdObj;
    callsByCategory: CallsByCategory | null;
    currentCallId: string | null | number;
    categoryCallsListObj: CategoryCallsListObj;
    setError: (value: boolean) => void;
    getPendingCalls: () => Promise<any>;
    getCallsCategories: () => Promise<any>;
    getCallsByCategoryId: () => Promise<any>;
    getChecklistsByCategoryId: () => Promise<any>;
    getDictionariesByCategoryId: () => Promise<any>;
    setCategoryId: (id: number | string | null) => void;
    setCategoryCallsListObjPerPage: (count: number) => void;
    setCategoryCallsListObjPage: (page: number) => void;
    setCurrentCallId: (id: string | null | number) => void;
    getCurrentCallInfo: (id: string | null | number) => Promise<CurrentCallInfo>;
    getPromptList: (id: string | null | number) => Promise<PromptList>;
    getAiJsonList: (orgId: string | null | number, callInfoId: number | undefined) => Promise<any>;
    setCategoryCallsFilterDate: (startDate: number | null, endDate: number | null) => void;
    categoriesChecklistsList:ChecklistsSearch[],
    getCategoriesCheckLists:() => Promise<any>;
    categoriesCheckListsObj:CheckListsByIdObj;
    categoriesDictionariesObj:CheckListsByIdObj;
    categoriesDictionariesList:CategoriesDictionariesList | null;
    getCategoriesDictionaries:() => Promise<any>;
    callsByCategories:any,
    categoriesIds:number[] | null;
    getCallsByCategories?:() => Promise<any[]>;
    setCategoriesIds: (arr: number[]) => void;

}