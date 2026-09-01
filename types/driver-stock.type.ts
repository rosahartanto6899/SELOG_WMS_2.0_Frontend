import { BaseState, BaseType, PaginationType } from "./base.type";

export interface ISummaryPayload {
  "branchId[]"?: string[];
  "shipmentType[]"?: string[];
  "employeeStatus[]"?: string[];
  searchBy?: string;
  search?: string;
}

export interface ISummaryResponse {
  transactionId: string;
  code: string;
  message: string;
  eTag: string;
  data: ISummaryResponseData;
}
export interface ISummaryResponseData {
  driverData: ISummaryResponseDriverData;
  driverInOutData: ISummaryResponseDriverInOutData[];
}
export interface ISummaryResponseDriverInOutData {
  month: number;
  pkwtIn: number;
  pkwtOut: number;
  mitraIn: number;
  mitraOut: number;
  total: number;
}
export interface ISummaryResponseDriverData {
  driverBranches: ISummaryResponseDriverBranch[];
  driverTotal: ISummaryResponseDriverTotal;
}
export interface ISummaryResponseDriverTotal {
  pkwt: number;
  mitra: number;
  total: number;
}
export interface ISummaryResponseDriverBranch {
  id: string;
  branchName: string;
  pkwt: number | string;
  mitra: number | string;
  total: number | string;
  ratioPkwt: number | string;
}

export interface IListResponseData {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeStatus: string;
  vkvd: string;
  branchId: string;
  serviceGroupId?: string;
  shipmentType: string;
  customerId?: string;
  startDate: string;
  endDate: string;
  joinDate: string;
  resignDate?: any;
  mcuDate: string;
  mcuResult?: any;
  birthPlace: string;
  birthDate: string;
  mobilePhone: string;
  email: string;
  citizenIdAddress: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpired: string;
  bankName: string;
  bankAccount: string;
  bankAccountHolder: string;
  note?: any;
  capacityStatus?: any;
  createdBy: string;
  updatedBy: string;
  deletedAt?: any;
  deletedBy?: any;
  createdAt: string;
  updatedAt: string;
  abilityAreas: string;
  abilityUnits: string;
  customerName: string;
  lastLocation: string;
  branchName: string;
  licenseStatus: string;
  driverStatus: string;
  contractStatus: string;
  fatigueStatus: string;
  hoursDriven: number;
}

export interface IListResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: IListResponseData[];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface IDetailsResponse {
  transactionId: string;
  code: string;
  message: string;
  eTag: string;
  data: IDetailsResponseData;
}

export interface IDetailsResponseDataHealthAssessment {
  healthResult: string;
  createdAt: string;
}
export interface IDetailsResponseDataTraining {
  trainingName: string;
  trainingStartDate: string;
  trainingEndDate: string;
}
export interface IDetailsResponseData {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeStatus: string;
  vkvd: string;
  branchId: string;
  shipmentType: string;
  customerId?: any;
  startDate: string;
  endDate: string;
  joinDate: string;
  resignDate?: any;
  mcuDate?: any;
  mcuResult?: any;
  birthPlace: string;
  birthDate: string;
  mobilePhone: string;
  email: string;
  citizenIdAddress: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpired: string;
  bankName?: any;
  bankAccount: string;
  bankAccountHolder: string;
  note?: any;
  capacityStatus: string;
  isAllotment: boolean;
  isActiveWaha: boolean;
  wahaServerPhone?: any;
  createdBy: string;
  updatedBy: string;
  deletedAt?: any;
  deletedBy?: any;
  createdAt: string;
  updatedAt: string;
  abilityAreas: any[];
  abilityUnits: any[];
  trainings: any[];
  contractStatus: string;
  branchName: string;
  customerName?: any;
  fatigueStatus?: any;
  licenseStatus: string;
  lastLocation?: any;
  historical: Historical;
  healthAssessment?: any;
}

export interface Historical {
  lastPreTripDate?: any;
  lastPreTripResult?: any;
  lastLocation?: any;
  fatigueStatus: string;
}

export interface IDetailsPayload {
  id: string;
}

export interface IUpdateNotePayload {
  id: string;
  note: string;
}

export interface IFilterResponse {
  transactionId: string;
  code: string;
  message: string;
  eTag: string;
  data: IFilterResponseData[];
}
export interface IFilterResponseData {
  id: string;
  name: string;
}

export interface IFilterDataOption {
  label: string;
  value: string;
}
export interface IFilterData {
  label: string;
  value: string;
  options: IFilterDataOption[];
}

export interface IDriverStockState extends BaseState<any[], BaseType> {
  getSummary: BaseState<ISummaryResponseData, ISummaryPayload>;
  getDetails: BaseState<IDetailsResponseData, IDetailsPayload>;
  getFilterOption: BaseState<any[]>;
  updateNote: BaseState<any, IUpdateNotePayload>;
}

export const driverStockTypes = {
  GET_SUMMARY: "driverStock/getSummaryFetch",
  GET_LIST_FETCH: "driverStock/getListFetch",
  GET_BY_ID_FETCH: "driverStock/getByIdFetch",
  GET_FILTERS_FETCH: "driverStock/getFilterFetch",
  UPDATE_NOTE_FETCH: "driverStock/updateNoteByIdFetch",
};
