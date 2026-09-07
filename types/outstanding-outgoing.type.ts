import { PaginationType } from "@sera-types/base.type";

export interface OutstandingOutgoingAddInfo {
  name?: string;
  value?: string;
}

export interface OutstandingOutgoingDetail {
  id: string;
  materialCode: string;
  materialName: string;
  materialBrand: string;
  materialBarcode?: string | null;
  materialLocationBarcode?: string | null;
  uom: string;
  poQty: number;
  pickingQty?: number;
  pickingDate?: string | null;
  description?: string | null;
  addInfos?: OutstandingOutgoingAddInfo[];
  canEdit?: boolean;
}

export interface OutstandingOutgoingHeader {
  id: string;
  customerCode?: string | null;
  customerName: string;
  warehouseCode?: string | null;
  warehouseName: string;
  deliveryNoteNo: string;
  poNo: string;
  poType?: string | null;
  poDate?: string | null;
  outgoingDate?: string | null;
  customerDestination?: string | null;
  referenceNo?: string | null;
  materialCategory?: string | null;
  description?: string | null;
  status?: string | null;
  isHold?: number;
  createdAt?: string | null;
  createdBy?: string | null;
  addInfos?: OutstandingOutgoingAddInfo[];
  details?: OutstandingOutgoingDetail[];
}

/** Payload input manual C1 */
export interface InputOutgoingPayload {
  customerCode: string;
  customerName: string;
  warehouseCode: string;
  warehouseName: string;
  poNo: string;
  poType?: string;
  poDate?: string;
  deliveryNoteNo: string;
  outgoingDate?: string;
  customerDestination?: string;
  referenceNo?: string;
  materialCategory?: string;
  description?: string;
  additionalInformation?: OutstandingOutgoingAddInfo[];
  details: Array<{
    materialCode: string;
    materialName: string;
    materialBrand: string;
    uom: string;
    qty: number;
    barcode?: string;
    locationBarcode?: string;
    additionalInformation?: OutstandingOutgoingAddInfo[];
  }>;
}

/** Payload submit mode edit — C3 header + baris C4/C2 */
export interface UpdateOutgoingPayload extends InputOutgoingPayload {
  id: string;
  /** detail lama yang bisa diedit → PUT /details/:id (qty + add-info) */
  updateDetails: Array<{
    detailId: string;
    qty: number;
    additionalInformation?: OutstandingOutgoingAddInfo[];
  }>;
}

export interface GetOutgoingEditResponse {
  data?: OutstandingOutgoingHeader | null;
  pagination?: PaginationType;
}

export interface OutstandingOutgoingState {
  submit: {
    isLoading: boolean;
    error: Error | string | null;
    success: boolean;
    message?: string | null;
  };
  edit: {
    isLoading: boolean;
    error: Error | string | null;
    data: OutstandingOutgoingHeader | null;
  };
}
