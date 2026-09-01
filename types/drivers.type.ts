import { BaseState, BaseType, PaginationType } from "./base.type";

export interface DriverRecord {
  no?: number;
  id: string;
  employeeId: string;
  employeeName: string;
  employeeStatus: string;
  vkvd: string;
  branchId: string;
  serviceGroupId: string | null;
  shipmentType: string;
  customerId: string | null;
  organization: string;
  startDate: string;
  endDate: string;
  joinDate: string;
  resignDate: string | null;
  mcuDate: string;
  mcuResult: string | null;
  birthPlace: string;
  birthDate: string;
  mobilePhone: string;
  email: string;
  citizenIdAddress: string;
  licenseType: string;
  licenseExpired: string;
  bankName: string;
  bankAccount: string;
  bankAccountHolder: string;
  note: string | null;
  createdBy: string;
  updatedBy: string;
  deletedAt: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  abilityAreas: string;
  abilityUnits: string;
  customerName: string;
  branchName: string;
  licenseStatus: string;
  driverStatus: string;
  fatiqueStatus: string;
  lastLocation: string;
  contractStatus: string;
}

export interface GetDriversResponse extends BaseType {
  status?: boolean;
  message?: string;
  data?: DriverRecord[] | [];
  code?: string;
  eTag?: string;
  pagination?: PaginationType;
}

export interface DriversState extends BaseState<DriverRecord[]> {
  autoComplete?: any;
  summary?: any;
}

export const driversTypes = {
  GET_DRIVERS: "drivers/getDrivers",
  GET_DRIVERS_FETCH: "drivers/getDriversFetch",
  GET_DRIVERS_SUCCESS: "drivers/getDriversSuccess",
  GET_DRIVERS_FAILURE: "drivers/getDriversFailure",
};
