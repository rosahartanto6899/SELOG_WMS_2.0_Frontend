import { BaseState, PaginationType } from "./base.type";

export interface PayloadDetails {
  id: string;
}

export interface ShipmentDetailsResponse {
  shipmentInformation: ShipmentInformation;
  shipmentDetail: ShipmentDetail;
  vehicleInformation: VehicleInformation;
  driverInformation: DriverInformation[];
  expense: Expense;
  activityHistories: ActivityHistory[];
}

export interface ActivityHistory {
  activity: string;
  description?: string;
  createdAt: string;
  createdBy: string;
}
export interface Expense {
  distanceWithCargo: number;
  toleranceWithCargo: number;
  totalDistanceCargo: number;
  distanceWithoutCargo: number;
  toleranceWithoutCargo: number;
  totalDistanceEmpty: number;
  totalDistance: number;
  fuelCargo: number;
  fuelEmpty: number;
  totalFuel: number;
  operationalCost: OperationalCost;
  incentive: Incentive;
  terminSummary: TerminSummary;
  total: number;
  expenseRatio: string;
}
export interface Incentive {
  incentiveKM: number;
  incentiveDaily: number;
  incentiveSIO: number;
  totalIncentive: number;
}
export interface OperationalCost {
  fuel: number;
  toll: number;
  mell: number;
  loadingUnloading: number;
  harborCrossing: number;
  workerContributions: number;
  security: number;
  totalCost: number;
  documentShippingFee: number;
}

export interface TerminSummary {
  termin1: number;
  termin2: number;
  termin3: number;
  termin4: number;
  termin5: number;
  termin6: number;
  totalTermin: number;
}
export interface DriverInformation {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeStatus: string;
  vkvd: string;
  branchId: string;
  shipmentType: string;
  customerId: string;
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
  bankName: string;
  bankAccount: string;
  bankAccountHolder: string;
  note?: any;
  capacityStatus: string;
  isAllotment: boolean;
  isActiveWaha: boolean;
  createdBy: string;
  updatedBy: string;
  deletedAt?: any;
  deletedBy?: any;
  createdAt: string;
  updatedAt: string;
  branch: BranchOrder;
  customer: AdditionalRequest;
  tiers: string;
}
export interface VehicleInformation {
  id: string;
  vin: string;
  licensePlate: string;
  branchId: string;
  branchName: string;
  vehicleTypeId: string;
  vehicleTypeName: string;
  vehicleTypeGroup: string;
  vehicleType: string;
  vehicleYear: string;
  vehicleStatus: string;
  vehicleDescription: string;
  shipmentType: string;
  customerId: string;
  ownership: string;
  hasObd: boolean;
  hasDashcam: boolean;
  licenseNumber: string;
  maintenanceStatus: string;
  planRegMaintenance: string;
  licenseExpired: string;
  licenseStatus: string;
  kirExpired: string;
  kirStatus: string;
  acquisitionDate: string;
  actualDisposalDate: string;
  customerAssignment: string;
  note: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: any;
  deletedAt: string;
  deletedBy?: any;
  customerName: string;
}
export interface ShipmentDetail {
  routeCode: string;
  pickupDate?: any;
  eta: string;
  tollUsage: number;
  jmpCode?: string;
  note?: any;
  routeLocations: RouteLocation[];
}
export interface RouteLocation {
  order: number;
  activityType: string;
  locationId: string;
  location: Location;
}
export interface Location {
  id: string;
  code: string;
  name: string;
  type: string;
  address: string;
  coordinate: string;
  district: District;
  city: City;
  province: Province;
  area: string;
  areaGroup: string;
  customerId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: string;
}
export interface Province {
  id: string;
  name: string;
  createdBy?: any;
  updatedBy?: any;
  deletedAt?: any;
  deletedBy?: any;
  createdAt?: any;
  updatedAt?: any;
}
export interface City {
  id: string;
  name: string;
  provinceId: string;
  createdBy?: any;
  updatedBy?: any;
  deletedAt?: any;
  deletedBy?: any;
  createdAt?: any;
  updatedAt?: any;
}
export interface District {
  id: string;
  name: string;
  area: string;
  areaGroup: string;
  cityId: string;
  createdBy?: any;
  updatedBy?: any;
  deletedAt?: any;
  deletedBy?: any;
  createdAt?: any;
  updatedAt?: any;
}
export interface ShipmentInformation {
  id: string;
  shipmentNo: string;
  bookingOrderNo: string;
  shipmentType: string;
  customerName: string;
  customerCmd: string;
  industry: string;
  category: string;
  soNumber?: any;
  soCreatedDate?: any;
  salesDealing: string;
  salesServicing: string;
  branchId: string;
  branchOrder: BranchOrder;
  revenue: number;
  contract: Contract;
  driver1: string;
  driver2?: any;
  additionalRequests: AdditionalRequest[];
}
export interface AdditionalRequest {
  id: string;
  name: string;
}
export interface Contract {
  id: string;
  customerId: string;
  contractNo: string;
  startDate: string;
  endDate: string;
  salesGroup: string;
  contractCreatedOn: string;
  contractCreatedBy: string;
  quotationSalesDocument: string;
  quotationValidFromDate: string;
  quotationValidToDate: string;
  quotationCreatedOn: string;
  quotationCreatedBy: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: any;
  deletedAt?: any;
  deletedBy?: any;
}
export interface BranchOrder {
  id: string;
  code: string;
  name: string;
  area: string;
}

export interface GetDetailsResponse {
  status?: boolean;
  message?: string;
  data?: ShipmentDetailsResponse;
  pagination?: PaginationType;
  code?: string;
  eTag?: string;
}

export interface InitialStateType {
  getDetails: BaseState<ShipmentDetailsResponse, PayloadDetails>;
}

export const shipmentDetailsTypes = {
  GET_DETAILS_FETCH: "shipmentDetails/getDetailsFetch",
  GET_DETAILS_SUCCESS: "shipmentDetails/getDetailsSuccess",
  GET_DETAILS_FAILURE: "shipmentDetails/getDetailsFailure",
};
