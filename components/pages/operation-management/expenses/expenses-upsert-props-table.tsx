/* eslint-disable @typescript-eslint/no-explicit-any */

import StatusTag from "@sera-components/status-tag";
import { ExpensesUpsertProps } from "@sera-types/expenses.type";

export type DataType = { id?: string; name?: string };

export interface DropdownBulk {
  shipmentType: DataType[];
  driverType: DataType[];
  branch: DataType[];
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
  "branch",
  "routeCode",
  "shipmentType",
  "driverType",
  "distanceCargo",
  "toleranceCargo",
  "totalDistanceCargo",
  "distanceEmpty",
  "toleranceEmpty",
  "totalDistanceEmpty",
  "totalDistance",
  "fuelCargo",
  "fuelEmpty",
  "totalFuel",
  "fuel",
  "toll",
  "mell",
  "loadingUnloading",
  "harborCrossing",
  "workerContributions",
  "security",
  "documentShippingFee",
  "totalCost",
  "incentiveKm",
  "incentiveDaily",
  "incentiveSio",
  "totalIncentive",
  "termin1",
  "termin2",
  "termin3",
  "termin4",
  "termin5",
  "termin6",
  "revenue",
  "totalExpense",
  "expenseRatio",
] as (keyof ExpensesUpsertProps)[];

const DISABLED_KEYS = [
  "branch",
  "routeCode",
  "totalDistanceCargo",
  "totalDistanceEmpty",
  "totalDistance",
  "totalFuel",
  "totalCost",
  "totalIncentive",
  "totalExpense",
  "expenseRatio",
];

export const IS_TYPE_NUMBER_KEYS = [
  "distanceCargo",
  "toleranceCargo",
  "totalDistanceCargo",
  "distanceEmpty",
  "toleranceEmpty",
  "totalDistanceEmpty",
  "totalDistance",
  "fuelCargo",
  "fuelEmpty",
  "totalFuel",
  "fuel",
  "toll",
  "mell",
  "loadingUnloading",
  "harborCrossing",
  "workerContributions",
  "security",
  "documentShippingFee",
  "totalCost",
  "incentiveKm",
  "incentiveDaily",
  "incentiveSio",
  "termin1",
  "termin2",
  "termin3",
  "termin4",
  "termin5",
  "termin6",
  "totalIncentive",
  "revenue",
  "totalExpense",
];

export const IS_CURRENCY_KEYS = [
  "fuel",
  "toll",
  "mell",
  "loadingUnloading",
  "harborCrossing",
  "workerContributions",
  "security",
  "documentShippingFee",
  "totalCost",
  "incentiveKm",
  "incentiveDaily",
  "incentiveSio",
  "termin1",
  "termin2",
  "termin3",
  "termin4",
  "termin5",
  "termin6",
  "totalIncentive",
  "revenue",
  "totalExpense",
];

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

export function validatingNumber(value?: string) {
  const _num = Number(value);
  return !Number.isNaN(_num) ? _num : 0;
}

export function payloadingData(_data?: DataType[], _key?: string) {
  return _data?.find(
    (_item) => _item?.name?.toUpperCase() === _key?.toUpperCase(),
  )?.id;
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
      driverType: validatingData(dropdown.driverType, _item?.driverType),
      shipmentType: validatingData(dropdown.shipmentType, _item?.shipmentType),

      // Type: Number
      distanceCargo: validatingNumber(_item?.distanceCargo),
      toleranceCargo: validatingNumber(_item?.toleranceCargo),
      totalDistanceCargo: validatingNumber(_item?.totalDistanceCargo),
      distanceEmpty: validatingNumber(_item?.distanceEmpty),
      toleranceEmpty: validatingNumber(_item?.toleranceEmpty),
      totalDistanceEmpty: validatingNumber(_item?.totalDistanceEmpty),
      totalDistance: validatingNumber(_item?.totalDistance),
      fuelCargo: validatingNumber(_item?.fuelCargo),
      fuelEmpty: validatingNumber(_item?.fuelEmpty),
      totalFuel: validatingNumber(_item?.totalFuel),
      fuel: validatingNumber(_item?.fuel),
      toll: validatingNumber(_item?.toll),
      mell: validatingNumber(_item?.mell),
      loadingUnloading: validatingNumber(_item?.loadingUnloading),
      harborCrossing: validatingNumber(_item?.harborCrossing),
      workerContributions: validatingNumber(_item?.workerContributions),
      security: validatingNumber(_item?.security),
      documentShippingFee: validatingNumber(_item?.documentShippingFee),
      totalCost: validatingNumber(_item?.totalCost),
      incentiveKm: validatingNumber(_item?.incentiveKm),
      incentiveDaily: validatingNumber(_item?.incentiveDaily),
      incentiveSio: validatingNumber(_item?.incentiveSio),
      termin1: validatingNumber(_item?.termin1),
      termin2: validatingNumber(_item?.termin2),
      termin3: validatingNumber(_item?.termin3),
      termin4: validatingNumber(_item?.termin4),
      termin5: validatingNumber(_item?.termin5),
      termin6: validatingNumber(_item?.termin6),
      totalIncentive: validatingNumber(_item?.totalIncentive),
      revenue: validatingNumber(_item?.revenue),
      totalExpense: validatingNumber(_item?.totalExpense),
    }));
}

export const Columns = ({
  data: {
    titles,
    dropdown: { driverType, shipmentType },
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
      align: ["branch", "routeCode"].includes(_key) ? "left" : "center",
      hidden: _key === "revenue",
      title: (() => {
        const t = titles?.[_key].replace(/\(Fee\)/g, "Fee");
        return t;
        // if (!t) return "";
        // const i = t.indexOf("(");
        // return (i === -1 ? t : t.slice(0, i)).trim();
      })(),
      // fixed: _key === "branch" || _key === "routeCode" ? "left" : "",
      isEditable: !DISABLED_KEYS.includes(_key),
      isNumber: IS_TYPE_NUMBER_KEYS.includes(_key),
      isCurrency: IS_CURRENCY_KEYS.includes(_key),
      // ...(_key === "branch" ? { relatedTo: branch } : {}),
      // ...(_key === "jmpCode" ? { relatedTo: jmpCode } : {}),
      ...(_key === "driverType" ? { relatedTo: driverType } : {}),
      ...(_key === "shipmentType" ? { relatedTo: shipmentType } : {}),
      // ...(_key === "routeCode" ? { relatedTo: routeCode } : {}),
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
        if (!_record?.split(",")?.[0]) return "";
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

export const SHIPMENT_TYPE_OPTIONS = [
  {
    id: "Ritase",
    name: "Ritase",
  },
  {
    id: "Dedicated",
    name: "Dedicated",
  },
];

export const EMPLOYEE_STATUS_TYPE = [
  {
    id: "PKWT",
    name: "PKWT",
  },
  {
    id: "Mitra",
    name: "MITRA",
  },
];
