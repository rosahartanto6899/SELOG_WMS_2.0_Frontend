import {
  AutoCompleteType,
  BaseResponseData,
  BaseState,
  PaginationType,
} from "./base.type";

export interface JMPState {
  getSummary: BaseState<Summary, FilterParams>;
  getJMPList: BaseState<JMPList[], FilterParams>;
  getACJMPList: BaseState<AutoCompleteType[], FilterParams>;
  createJMP: BaseState<CreateJMPPayload>;
  detailJMP: BaseState<DetailJMP, DetailJMPPayload>;
  updateJMP: BaseState<UpdateJMPPayload>;
}

export interface FilterParams {
  specificCustomer?: string[];
  tollUsage?: string[];
}

export interface Summary {
  totalJMP?: number;
  nonToll?: number;
  toll?: number;
  combine?: number;
}

export interface JMPList extends BaseResponseData {
  no?: number;
  id?: string;
  origin?: string;
  destination?: string;
  originName?: string;
  destinationName?: string;
  tollUsage?: number;
  specificCustomer?: boolean;
  totalCheckpoint?: number;
  customer?: { id?: string; name?: string };
  tollUsageCategory?: { id?: number; name?: string };
}

export interface DetailJMP extends BaseResponseData {
  id?: string;
  jmpCode?: string;
  origin?: string;
  originName?: string;
  destination?: string;
  destinationName?: string;
  tollUsage?: number;
  tollUsageCategory?: { name?: string };
  specificCustomer?: boolean;
  customer?: { id?: string; name?: string };
  details?: {
    id?: string;
    locationId?: string;
    locationName?: string;
    coordinate?: string;
    address?: string;
  }[];
}

export interface CreateJMPPayload {
  origin?: string;
  destination?: string;
  tollUsage?: number;
  specificCustomer?: number;
  customerId?: string;
  jmpDetails?: string[];
}

export interface DetailJMPPayload {
  id?: string;
}

export interface UpdateJMPPayload {
  id?: string;
  specificCustomer?: number;
  customerId?: string;
  jmpDetails?: string[];
}

export interface GetSummaryResponse {
  status?: boolean;
  message?: string;
  data?: Summary;
  code?: string;
  eTag?: string;
}

export interface GetJMPListResponse {
  status?: boolean;
  message?: string;
  data?: JMPList[];
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface GetDetailJMPResponse {
  status?: boolean;
  message?: string;
  data?: DetailJMP;
  code?: string;
  eTag?: string;
}

export const jmpTypes = {
  GET_SUMMARY: "jmp/getSummary",
  GET_SUMMARY_FETCH: "jmp/getSummaryFetch",
  GET_SUMMARY_SUCCESS: "jmp/getSummarySuccess",
  GET_SUMMARY_FAILURE: "jmp/getSummaryFailure",

  GET_JMP_LIST: "jmp/getJMPList",
  GET_JMP_LIST_FETCH: "jmp/getJMPListFetch",
  GET_JMP_LIST_SUCCESS: "jmp/getJMPListSuccess",
  GET_JMP_LIST_FAILURE: "jmp/getJMPListFailure",

  GET_AC_JMP_LIST: "jmp/getACJMPList",
  GET_AC_JMP_LIST_FETCH: "jmp/getACJMPListFetch",
  GET_AC_JMP_LIST_SUCCESS: "jmp/getACJMPListSuccess",
  GET_AC_JMP_LIST_FAILURE: "jmp/getACJMPListFailure",

  CREATE_JMP: "jmp/createJMP",
  CREATE_JMP_FETCH: "jmp/createJMPFetch",
  CREATE_JMP_SUCCESS: "jmp/createJMPSuccess",
  CREATE_JMP_FAILURE: "jmp/createJMPFailure",

  DETAIL_JMP: "jmp/detailJMP",
  DETAIL_JMP_FETCH: "jmp/detailJMPFetch",
  DETAIL_JMP_SUCCESS: "jmp/detailJMPSuccess",
  DETAIL_JMP_FAILURE: "jmp/detailJMPFailure",

  UPDATE_JMP: "jmp/updateJMP",
  UPDATE_JMP_FETCH: "jmp/updateJMPFetch",
  UPDATE_JMP_SUCCESS: "jmp/updateJMPSuccess",
  UPDATE_JMP_FAILURE: "jmp/updateJMPFailure",
};
