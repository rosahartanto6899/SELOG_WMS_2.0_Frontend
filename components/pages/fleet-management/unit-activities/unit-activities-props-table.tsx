import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { EditOutlined } from "@sera-components/icons";
import StatusTag from "@sera-components/status-tag";
import { Unit, UnitMaintenance } from "@sera-types/unit-activity";
import {
  DATE_FORMAT,
  FORMAT_DATE_TIME,
  MONTH_NAMES,
  WEEKS,
} from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Row, Tooltip } from "antd";
import { startCase, toLower } from "lodash";
import moment from "moment";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import useGetPermissionFleetManagement from "../hooks/useGetPermission";

export const MAINTENANCE_LEVEL = ["Heavy", "Medium", "Light"];

interface ColumnsMaintenanceStatusProps {
  branches: string[];
}

export const DETAIL_MAINTENANCE_DEFAULT_UNCHECK = ["ageOfUnit"];

export const DetailMaintenanceSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitActivities.table.detailMaintenance.options",
  });

  return [
    { label: t("0"), value: "licensePlate" },
    { label: t("1"), value: "maintenanceLevel" },
    { label: t("2"), value: "status" },
  ];
};

export const ColumnsMaintenanceStatus = ({
  branches,
}: ColumnsMaintenanceStatusProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitActivities.table.maintenanceStatus.column",
  });

  return [
    {
      key: "category",
      dataIndex: "category",
      title: t("category"),
      fixed: "left",
    },
    ...branches.map((_item) => ({
      key: _item,
      dataIndex: _item,
      title: _item,
      align: "center",
      children: MAINTENANCE_LEVEL?.map((_level) => ({
        key: _item + _level,
        dataIndex: _item + _level,
        title: _level,
        align: "center",
      })),
    })),
    {
      key: "total",
      dataIndex: "total",
      title: t("total"),
      fixed: "right",
      render: (_record: string) => <strong>{_record}</strong>,
    },
  ]?.map((_column) => ({
    ..._column,
    align: _column?.key === "category" ? "left" : "center",
  }));
};

export const ColumnsDetailMaintenance = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitActivities.table.detailMaintenance",
  });

  const { t: tGlobal } = useTranslation(undefined, {
    keyPrefix: "global.commons",
  });

  const { isUpdate } = useGetPermissionFleetManagement("unit-activities");

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
      key: "maintenanceStatus",
      dataIndex: "maintenanceStatus",
      title: t("column.maintenanceStatus"),
      align: "center",
      render: (_record: string) => <StatusTag value={_record} block />,
    },
    {
      key: "maintenanceDuration",
      dataIndex: "maintenanceDuration",
      title: t("column.maintenanceDuration"),
      align: "center",
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
      key: "unitYear",
      dataIndex: "unitYear",
      title: t("column.unitYear"),
      align: "center",
    },
    {
      key: "ageOfUnit",
      dataIndex: "ageOfUnit",
      title: (
        <Tooltip title={tGlobal("months")}>{t("column.ageOfUnit")}</Tooltip>
      ),
      align: "center",
      render: (_: never, _entry: Unit) => {
        const _startDate = moment(_entry?.acquisitionDate);
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
      key: "maintenanceType",
      dataIndex: "maintenanceType",
      title: t("column.maintenanceType"),
    },
    {
      key: "maintenanceCategory",
      dataIndex: "maintenanceCategory",
      title: t("column.maintenanceCategory"),
    },
    {
      key: "maintenanceLevel",
      dataIndex: "maintenanceLevel",
      title: t("column.maintenanceLevel"),
      render: (_record: string) => startCase(toLower(_record)),
    },
    {
      key: "planStartDate",
      dataIndex: "planStartDate",
      title: t("column.planStartDate"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "actualStartDate",
      dataIndex: "actualStartDate",
      title: t("column.actualStartDate"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "estimationActualEndDate",
      dataIndex: "estimationActualEndDate",
      title: t("column.estimationActualEndDate"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "actions",
      dataIndex: "id",
      title: t("column.actions"),
      fixed: "right",
      align: "center",
      exception: true,
      render: (_record: UnitMaintenance) => (
        <Row justify="center" gutter={[8, 4]}>
          <Col>
            <Link
              id="link-detail-unit-activities"
              href={`${ROUTE.FLEET_MANAGEMENT.UNIT_ACTIVITIES}/${_record}`}
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
                id="link-edit-unit-activities"
                href={`${ROUTE.FLEET_MANAGEMENT.UNIT_ACTIVITIES}/edit/${_record}`}
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
  ];
};

export const ColumnsForecastUnit = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitActivities.table.forecastUnit",
  });

  return [
    {
      key: "period",
      title: t("column.period.title"),
      children: [
        {
          key: "forecastUnit",
          dataIndex: "forecastUnit",
          title: t("column.period.forecastUnit.title"),
          fixed: "left",
        },
      ],
    },
    ...MONTH_NAMES?.map((_month) => ({
      key: _month,
      title: _month,
      align: "center",
      children: WEEKS?.map((_week) => ({
        key: _month + _week,
        dataIndex: _month + _week,
        title: _week,
        align: "center",
      })),
    })),
    {
      key: "current",
      dataIndex: "current",
      title: t("column.current"),
      align: "center",
      fixed: "right",
      render: (_record: string) => <strong>{_record}</strong>,
    },
  ];
};
