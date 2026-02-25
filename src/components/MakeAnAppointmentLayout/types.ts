export interface AppointmentsData {
    targeted_communications: number;
    next_contact_assigned: number;
    percentage_of_appointments_made: number;
}

export interface DirectionsData {
    targeted_communications: number;
    meeting: number;
    call_or_messenger: number;
    not_defined: number;
}

export interface EmployeeReportItem {
    name: string;
    total_calls: number;
    next_contact_assigned: number;
    not_next_contact_assigned: number;
    percentage_of_appointments_made: number;
    meeting: number;
    call_or_messenger: number;
    not_defined: number;
    call_share: number;
    quality: number;
    kpi: number;
}

export interface ReportData {
    number_of_appointments_and_calls: AppointmentsData;
    distribution_by_directions: DirectionsData;
    // employee_report: EmployeeReportItem[];
}
export interface ManagersReportData {
    items: EmployeeReportItem[];
    total: number;
    total_pages:number;
}


export interface Category {
    id: number;
    name: string;
    description: string;
    channel_one_name: string;
    channel_two_name: string;
    trigger_limit_min: string;
    trigger_limit_max: string;
    last_indexed_file: null | string;
    who_delete: null | string;
    created_at: null | string;
    updated_at: null | string;
    deleted_at: null | string;
    agents: any[];
}

export interface SubLocation {
    id: number;
    location_id: number;
    name: string;
    description: string;
    categories: Category[];
}

export interface Location {
    id: number;
    name?: string;
    description?: string;
    sub_locations?: SubLocation[];
}

export interface CascaderOption {
    value: number;
    label?: string;
    children?: CascaderOption[];
    disabled?: boolean;
}