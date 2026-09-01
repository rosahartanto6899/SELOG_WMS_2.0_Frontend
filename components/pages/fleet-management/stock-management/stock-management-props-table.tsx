/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { BookEdit, EditOutlined, Refresh } from "@sera-components/icons";
import StatusTag from "@sera-components/status-tag";
import { LoadingState } from "@sera-types/loading.type";
import {
  StockManagement,
  UnitBranches,
} from "@sera-types/stock-management.type";
import { unitActivityTypes } from "@sera-types/unit-activity";
import { DATE_FORMAT, MONTH_NAMES } from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Row, Tooltip } from "antd";
import moment from "moment";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import useGetPermissionFleetManagement from "../hooks/useGetPermission";

interface ColumnsSummaryProps {
  branches: UnitBranches[];
}

export const ColumnsSummary = ({ branches }: ColumnsSummaryProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "stockManagement.tableSummary.column",
  });

  const _renderSummary = (
    _record: string | number,
    _item: { indicator: string },
  ) => {
    if (_item?.indicator === "Ratio UTSP") return <strong>{_record}</strong>;
    return _record;
  };

  return [
    {
      key: "indicator",
      dataIndex: "indicator",
      title: t("indicator"),
      fixed: "left",
      width: 120,
    },
    ...branches.map((_branch: UnitBranches) => ({
      key: _branch?.branchName,
      dataIndex: _branch.branchName,
      title: _branch.branchName,
    })),
    {
      key: "total",
      dataIndex: "total",
      title: t("total"),
      fixed: "right",
    },
  ]?.map((_column) => ({
    ..._column,
    align: _column?.key === "indicator" ? "left" : "center",
    render: _renderSummary,
  }));
};

interface ColumnsStockUnitProps {
  loading?: LoadingState;
  refetchLastLocation?: (_record: any) => void;
  activeVin?: string;
}

export const STOCK_UNIT_DEFAULT_UNCHECK = [
  "acquisitionDate",
  "description",
  "kirExpired",
  "licenseExpired",
  "planRegMaintenance",
];

export const StockUnitSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "stockManagement.table.options",
  });

  return [
    { label: t("0"), value: "licensePlate" },
    { label: t("1"), value: "hasObd" },
    { label: t("2"), value: "maintenanceStatus" },
    { label: t("3"), value: "licenseStatus" },
    { label: t("4"), value: "kirStatus" },
  ];
};

export const ColumnsStockUnit = ({
  loading,
  refetchLastLocation,
  activeVin,
}: ColumnsStockUnitProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "stockManagement.table",
  });

  const { t: tGlobal } = useTranslation(undefined, {
    keyPrefix: "global.commons",
  });

  const { isUpdate } = useGetPermissionFleetManagement("stock-management");

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
      exception: true,
    },
    {
      key: "branchName",
      dataIndex: "branchName",
      title: t("column.branchName"),
      fixed: "left",
    },
    {
      key: "licensePlate",
      dataIndex: "licensePlate",
      title: t("column.licensePlate"),
      fixed: "left",
    },
    {
      key: "status",
      dataIndex: "status",
      title: t("column.status"),
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "planRegMaintenance",
      dataIndex: "planRegMaintenance",
      title: t("column.planRegMaintenance"),
      align: "center",
      render: (_record: string) => DATE_FORMAT(_record),
    },
    {
      key: "maintenanceStatus",
      dataIndex: "maintenanceStatus",
      title: t("column.maintenanceStatus"),
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "licenseExpired",
      dataIndex: "licenseExpired",
      title: t("column.licenseExpired"),
      align: "center",
      sorter: true,
      defaultView: false,
    },
    {
      key: "licenseStatus",
      dataIndex: "licenseStatus",
      title: t("column.licenseStatus"),
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "kirExpired",
      dataIndex: "kirExpired",
      title: t("column.kirExpired"),
      align: "center",
      sorter: true,
    },
    {
      key: "kirStatus",
      dataIndex: "kirStatus",
      title: t("column.kirStatus"),
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "unitType",
      dataIndex: "unitType",
      title: t("column.unitType"),
    },
    {
      key: "description",
      dataIndex: "description",
      title: t("column.description"),
    },
    {
      key: "vehicleYear",
      dataIndex: "vehicleYear",
      title: t("column.unitYear"),
      align: "center",
    },
    {
      key: "acquisitionDate",
      dataIndex: "acquisitionDate",
      title: (
        <Tooltip title={tGlobal("months")}>{t("column.ageOfUnit")}</Tooltip>
      ),
      align: "center",
      render: (_record: string) => {
        if (!_record) return "-";

        const _startDate = moment(_record);
        const _endDate = moment();

        const _duration = moment.duration(_endDate.diff(_startDate));
        const _totalMonth = _endDate.diff(_startDate, "months");

        return (
          <Tooltip
            title={`${_duration?.years()} ${tGlobal("years")} ${_duration?.months()} ${tGlobal("months")} ${_duration?.days()} ${tGlobal("days")} `}
          >
            {_totalMonth}
          </Tooltip>
        );
      },
    },
    {
      key: "shipmentType",
      dataIndex: "shipmentType",
      title: t("column.shipmentType"),
    },
    {
      key: "customerAssignment",
      dataIndex: "customerAssignment",
      title: t("column.customerAssignment"),
    },
    {
      key: "statusObd",
      dataIndex: "statusObd",
      title: t("column.statusObd"),
      render: (_record: string, _row: StockManagement) => (
        <Row gutter={16} align="middle">
          <Col>
            <StatusTag value={_record} />
          </Col>

          {_record === "Failed" ? (
            <Row>
              <Button
                id="get-last-location-button"
                size="small"
                tooltip={t("tooltip.statusObd")}
                icon={<Refresh />}
                onClick={(_event) => {
                  _event?.preventDefault();
                  if (refetchLastLocation) refetchLastLocation(_row?.vin);
                }}
                loading={
                  loading
                    ? activeVin === _row?.vin &&
                      loading[unitActivityTypes.GET_LAST_LOCATION]
                    : false
                }
                disabled={
                  loading
                    ? activeVin !== _row?.vin &&
                      loading[unitActivityTypes.GET_LAST_LOCATION]
                    : false
                }
              />
            </Row>
          ) : null}
        </Row>
      ),
    },
    {
      key: "lastUpdateObd",
      dataIndex: "lastUpdateObd",
      title: t("column.lastUpdateObd"),
    },
    {
      key: "lastLocation",
      dataIndex: "lastLocation",
      title: t("column.lastLocation"),
      width: 200,
      truncate: true,
    },
    {
      key: "actions",
      dataIndex: "id",
      title: t("column.actions"),
      fixed: "right",
      align: "center",
      exception: true,
      render: (_record: string) => (
        <Row justify="center" gutter={[8, 4]}>
          <Col>
            <Link
              id="link-edit-unit-activities"
              href={`${ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT}/edit/km-check/${_record}`}
              passHref
            >
              <Button
                id="edit-button"
                size="small"
                tooltip={t("button.kmCheck.tooltip")}
                type="link"
                icon={<BookEdit />}
              />
            </Link>
          </Col>

          <Col>
            <Link
              id="link-detail-customer-route"
              href={`${ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT}/${_record}`}
              passHref
            >
              <Button
                id="detail-button"
                size="small"
                tooltip={t("button.detail.tooltip")}
                type="link"
                icon={<EyeOutlined />}
              />
            </Link>
          </Col>

          {isUpdate ? (
            <Col>
              <Link
                id="link-edit-stock-management"
                href={`${ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT}/edit/${_record}`}
                passHref
              >
                <Button
                  id="edit-button"
                  size="small"
                  tooltip={t("button.update.tooltip")}
                  type="link"
                  icon={<EditOutlined />}
                />
              </Link>
            </Col>
          ) : null}
        </Row>
      ),
    },
  ]?.map((_column) => ({ ..._column, hidden: false }));
};

export const ColumnsInOut = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "stockManagement.tableInOut.column",
  });

  const _renderSummary = (
    _record: string | number,
    _item: { indicator: string },
  ) => {
    if (_item?.indicator === "Total") return <strong>{_record}</strong>;
    return _record;
  };

  return [
    {
      key: "indicator",
      dataIndex: "indicator",
      title: t("indicator"),
      width: 120,
    },
    ...MONTH_NAMES.map((_monthName) => ({
      key: _monthName,
      dataIndex: _monthName,
      title: _monthName,
    })),
  ]?.map((_column) => ({
    ..._column,
    align: _column?.key === "indicator" ? "left" : "center",
    render: _renderSummary,
  }));
};
