export interface ClientCardBaseData {
  names?: string[];
  place_of_residence?: string[];
  gender?: string[];
  marital_status?: string[];
  job_title?: string[];
  place_of_work?: string[];
  field_of_activity?: string[];
  presence_of_children?: string[];
  hobby?: string[];
  age?: string[];
  total_calls?: number;
  last_trade_amount?: string;
  price_range?: string;
  last_probability_of_making_deal?: string;
  probability_of_making_deal?: string;
  date_first_communication?: string;
  date_last_communication?: string;
}

export interface ClientLastCall {
  id: number;
  call_id: string;
  origin_call_id: string;
  date_call: string;
  manager: string;
  customer_satisfaction: string;
  essence_of_the_call: string;
  next_step: string;
  next_contact_date: string;
  identified_problem: string;
  employee_did_not_process_the_objection: string;
  what_should__manager_do: string;
}

export interface ClientsStoreState {
  error: boolean;
  clientsPhonesTotal: number;
  clientsFoundTotal: number;
  clientNumbers: string[];
  clientsSearchLoading: boolean;
  clientCardLoading: boolean;
  clientCardBase: ClientCardBaseData | null;
  clientLastCalls: ClientLastCall[];
  activeClientNumber: string | null;
  getClientPhonesList: (orgId: number | string) => Promise<number>;
  findClient: (
    orgId: number | string,
    clientNumber: string,
    page?: number,
    size?: number,
  ) => Promise<{ total: number; clientNumbers: string[] }>;
  resetClientSearchResults: () => void;
  getClientCardBase: (
    orgId: number | string,
    clientNumber: string,
  ) => Promise<ClientCardBaseData | null>;
  getClientCardLastCalls: (
    orgId: number | string,
    clientNumber: string,
  ) => Promise<ClientLastCall[]>;
  loadClientCard: (orgId: number | string, clientNumber: string) => Promise<void>;
  clearClientCard: () => void;
}
