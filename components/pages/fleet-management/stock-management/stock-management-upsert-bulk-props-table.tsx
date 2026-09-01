/* eslint-disable @typescript-eslint/no-explicit-any */

import StatusTag from "@sera-components/status-tag";
import dayjs from "dayjs";

import { CONST_SHIPMENT_TYPE } from "./stock-management-form";

export type DataType = { id?: string; name?: string };

interface DropdownBulk {
  branch: DataType[];
  vehicleType: DataType[];
  hasDashcam: DataType[];
  hasObd: DataType[];
  customer: DataType[];
  ownership: DataType[];
  shipmentType: DataType[];
  vehicleStatus: DataType[];
}

export interface DataBulk {
  titles: { [_key: string]: string };
  dropdown: DropdownBulk;
}

interface ColumnsProps {
  data: DataBulk;
}

export const HEADER_KEYS = [
  "vin",
  "licensePlate",
  "branchId",
  "vehicleTypeId",
  "vehicleDescription",
  "vehicleYear",
  "vehicleStatus",
  "shipmentType",
  "customerId",
  "ownership",
  "hasObd",
  "hasDashcam",
  "licenseNumber",
  "licenseExpired",
  "kirExpired",
  "acquisitionDate",
  "actualDisposalDate",
  "planRegMaintenance",
  "note",
] as const;

export const UPSERT_STATUS = ["UPLOADING", "SUCCESS", "FAILED"] as const;

export function FormatConstant(data: { [_key: string]: string }[]) {
  return data?.reduce(
    (_prev, { id, name }) => {
      if (id) _prev[id] = name ?? "";
      return _prev;
    },
    {} as { [_key: string]: string },
  );
}

function validatingData(_data: DataType[], _key: string) {
  return _data?.find(
    (_item) => _item?.name?.toUpperCase() === _key?.toUpperCase(),
  )?.name;
}

export function payloadingData(_data?: DataType[], _key?: string) {
  return _data?.find(
    (_item) => _item?.name?.toUpperCase() === _key?.toUpperCase(),
  )?.id;
}

export function validatingDate(_data?: string, _isTime?: boolean) {
  if (!_data) return undefined;

  const _parsed = dayjs(_data);
  if (!_parsed.isValid()) return undefined;

  return _isTime
    ? _parsed.format("YYYY-MM-DD HH:mm")
    : _parsed.format("YYYY-MM-DD");
}

export function ValidationData(
  _data: { [_key: string]: string }[],
  _type: DataType[],
  _dropdown: DropdownBulk,
) {
  return _data
    .map((_item) => {
      return _type.reduce(
        (_prev, { id, name }) => {
          if (id && name) _prev[id] = _item[name];
          return _prev;
        },
        {} as { [_key: string]: string },
      );
    })
    ?.map((_item, _index) => {
      const _result = {
        ..._item,
        no: `${_index + 1}`,
        upsertStatus: "",
        upsertReason: "",

        // pre-manipulation
        shipmentType: "",
        customerId: "",

        // Type: Select
        branchId: validatingData(_dropdown?.branch, _item?.branchId),
        hasObd: validatingData(_dropdown?.hasObd, _item?.hasObd),
        hasDashcam: validatingData(_dropdown?.hasDashcam, _item?.hasDashcam),
        ownership: validatingData(_dropdown?.ownership, _item?.ownership),

        vehicleTypeId: validatingData(
          _dropdown?.vehicleType,
          _item?.vehicleTypeId,
        ),
        vehicleStatus: validatingData(
          _dropdown?.vehicleStatus,
          _item?.vehicleStatus,
        ),

        // Type: Date
        kirExpired: validatingDate(_item?.kirExpired),
        licenseExpired: validatingDate(_item?.licenseExpired),
        acquisitionDate: validatingDate(_item?.acquisitionDate),
        actualDisposalDate: validatingDate(_item?.actualDisposalDate),
        planRegMaintenance: validatingDate(_item?.planRegMaintenance),
      };

      const _shipmentType = validatingData(
        _dropdown?.shipmentType,
        _item?.shipmentType,
      );

      const _customerId = validatingData(
        _dropdown?.customer,
        _item?.customerId,
      );

      _result.shipmentType = _shipmentType ?? "";
      if (_shipmentType === CONST_SHIPMENT_TYPE[1]) {
        _result.customerId = _customerId ?? "";
      }

      return _result;
    });
}

export const Columns = ({
  data: {
    titles,
    dropdown: {
      branch,
      customer,
      hasDashcam,
      hasObd,
      ownership,
      shipmentType,
      vehicleStatus,
      vehicleType,
    },
  },
}: ColumnsProps) => {
  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
    },
    ...HEADER_KEYS?.map((_key: (typeof HEADER_KEYS)[number]) => ({
      key: _key,
      dataIndex: _key,
      title: (() => {
        const t = titles?.[_key];
        if (!t) return "";
        const i = t.indexOf("(");
        return (i === -1 ? t : t.slice(0, i)).trim();
      })(),
      fixed: _key === "vin" || _key === "licensePlate" ? "left" : "",
      isEditable: true,
      ...(_key === "branchId" ? { relatedTo: branch } : {}),
      ...(_key === "customerId" ? { relatedTo: customer } : {}),
      ...(_key === "hasDashcam" ? { relatedTo: hasDashcam } : {}),
      ...(_key === "hasObd" ? { relatedTo: hasObd } : {}),
      ...(_key === "ownership" ? { relatedTo: ownership } : {}),
      ...(_key === "shipmentType" ? { relatedTo: shipmentType } : {}),
      ...(_key === "vehicleStatus" ? { relatedTo: vehicleStatus } : {}),
      ...(_key === "vehicleTypeId" ? { relatedTo: vehicleType } : {}),

      isDate:
        _key === "acquisitionDate" ||
        _key === "actualDisposalDate" ||
        _key === "kirExpired" ||
        _key === "licenseExpired" ||
        _key === "planRegMaintenance",
    })),
    {
      key: "upsertStatus",
      dataIndex: "upsertStatus",
      title: "Status",
      fixed: "right",
      render: (_record: string) => {
        if (_record) return <StatusTag value={_record} block />;
        return "";
      },
    },
    {
      key: "upsertReason",
      dataIndex: "upsertReason",
      title: "Reason",
      fixed: "right",
      render: (_record: string) => {
        if (!_record) return null;

        return (
          <ul
            style={{
              maxWidth: 320,
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {_record?.split(",")?.map((_msg, _index) => (
              <li key={_index}>
                <div>{_msg}</div>
              </li>
            ))}
          </ul>
        );
      },
    },
  ];
};
