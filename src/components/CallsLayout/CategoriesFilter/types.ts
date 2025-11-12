
export  interface Category {
    id: number;
    sub_location_id: number;
    name: string;
    description: string;
    channel_one_name: string;
    channel_two_name: string;
    trigger_limit_min: string;
    trigger_limit_max: string;
    last_indexed_file: string | null;
    who_delete: string | null;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
    agents: any[];
}

export interface SubLocation {
    id: number;
    location_id: number;
    name: string;
    description: string;
    categories: Category[];
}
export interface CategoryLocation {
    id: number;
    name: string;
    description: string;
    sub_locations: SubLocation[];
}