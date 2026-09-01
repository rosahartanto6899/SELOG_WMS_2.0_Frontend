/* eslint-disable @typescript-eslint/no-explicit-any */

import StatusTag from "@sera-components/status-tag";
import dayjs from "dayjs";

export type DataType = { id?: string; name?: string };

interface DropdownBulk {
  branchOrder: DataType[];
  shipmentType: DataType[];
  customerName: DataType[];
  unitType: DataType[];
  routeCode: DataType[];
}

export interface DataBulk {
  titles: { [_key: string]: string };
  dropdown: DropdownBulk;
}

interface ColumnsProps {
  data: DataBulk;
}

export const HEADER_KEYS = [
  "salesName",
  "branchOrder",
  "pickupDate",
  "customerName",
  "shipmentType",
  "unitType",
  "routeCode",
  "qtyUnit",
  "qtyDriver",
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
  data: { [_key: string]: string }[],
  key: DataType[],
  dropdown: DropdownBulk,
) {
  return data
    .map((_item) => {
      return key.reduce(
        (_prev, { id, name }) => {
          if (id && name) _prev[id] = _item[name];
          return _prev;
        },
        {} as { [_key: string]: string },
      );
    })
    ?.map((_item, _index) => ({
      ..._item,
      no: `${_index + 1}`,
      upsertStatus: "",
      upsertReason: "",

      // Type: Select
      branchOrder: validatingData(dropdown.branchOrder, _item?.branchOrder),
      shipmentType: validatingData(dropdown.shipmentType, _item?.shipmentType),
      customerName: validatingData(dropdown.customerName, _item?.customerName),
      unitType: validatingData(dropdown.unitType, _item?.unitType),
      routeCode: validatingData(dropdown.routeCode, _item?.routeCode),

      // Type: Date
      pickupDate: validatingDate(_item?.pickupDate),
    }));
}

export const Columns = ({
  data: {
    titles,
    dropdown: { branchOrder, customerName, routeCode, shipmentType, unitType },
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
      fixed: _key === "salesName" || _key === "branchOrder" ? "left" : "",
      isEditable: true,
      ...(_key === "branchOrder" ? { relatedTo: branchOrder } : {}),
      ...(_key === "customerName" ? { relatedTo: customerName } : {}),
      ...(_key === "shipmentType" ? { relatedTo: shipmentType } : {}),
      ...(_key === "routeCode" ? { relatedTo: routeCode } : {}),
      ...(_key === "unitType" ? { relatedTo: unitType } : {}),

      isDate: _key === "pickupDate",
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
      render: (_record: string) => (
        <div
          style={{
            maxWidth: 320,
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {_record}
        </div>
      ),
    },
  ];
};
