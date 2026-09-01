/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import StatusTag from "@sera-components/status-tag";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import {
  UnitActivityState,
  unitActivityTypes,
} from "@sera-types/unit-activity";
import { DATE_FORMAT, NUMBER_FORMAT } from "@sera-utils/constants/common";
import { Col, Empty, FormInstance, Row, Steps } from "antd";
import { isEmpty } from "lodash";
import moment from "moment";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

export const CONST_YES_NO = ["Yes", "No"];
export const CONST_OWNERSHIP = ["OWNED", "VENDOR"];
export const CONST_SHIPMENT_TYPE = ["Ritase", "Dedicated", "Not Defined"];
export const CONST_VEHICLE_STATUS = ["USP", "UTSP"];

interface StockManagementFormKMCheckProps {
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;

  loadingState: LoadingState;
  unitActivity: UnitActivityState;
}

const StockManagementFormKMCheck = ({
  form,
  loading,
  onSubmit,
  loadingState,
  unitActivity,
}: StockManagementFormKMCheckProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "stockManagement.formKMCheck",
  });

  const { t: tGlobal } = useTranslation(undefined, {
    keyPrefix: "global.commons",
  });

  const messageRequired = t("message.required");

  const KM_CHECK = useMemo(() => {
    const _data = unitActivity?.pmCheckDetail?.data?.pmcheck;
    if (!_data) return [];

    return _data?.map((_item) => ({
      title: DATE_FORMAT(_item?.createdAt, "YYYY-MM-DD HH:mm") ?? "-",
      description: (
        <>
          <div>KM: {NUMBER_FORMAT(_item?.KM)}</div>
          <div>{_item?.createdByName || "-"}</div>
        </>
      ),
    }));
  }, [unitActivity?.pmCheckDetail?.data?.pmcheck]);

  const FORM_CONFIG = [
    {
      id: "vehicleId",
      type: "text",
      name: "vehicleId",
      label: t("input.vehicleId.label"),
      disabled: true,
    },
    {
      id: "status",
      type: "switch",
      name: "status",
      label: t("input.status.label"),
      disabled: true,
    },
    {
      id: "unitType",
      type: "text",
      name: "unitType",
      label: t("input.unitType.label"),
      disabled: true,
    },
    {
      id: "vehicleDescription",
      type: "text",
      name: "vehicleDescription",
      label: t("input.vehicleDescription.label"),
      disabled: true,
    },
    {
      id: "ageOfUnit",
      type: "text",
      name: "ageOfUnit",
      label: (
        <span>
          {t("input.ageOfUnit.label")} (
          <strong>{t("input.vehicleYear.label")}</strong>:{" "}
          {unitActivity?.pmCheckDetail?.data?.vehicleYear})
        </span>
      ),
      disabled: true,
    },
    {
      id: "branch",
      type: "text",
      name: "branch",
      label: t("input.branch.label"),
      disabled: true,
    },
    {
      id: "licenseStatus",
      type: "text",
      name: "licenseStatus",
      disabled: true,
      dependency: {
        fields: [],
        label: () => {
          const _data = unitActivity?.pmCheckDetail?.data?.licenseExpired;
          if (!_data) return t("input.licenseStatus.label");

          return (
            <span>
              {t("input.licenseStatus.label")}{" "}
              <StatusTag
                value={
                  unitActivity?.pmCheckDetail?.data?.licenseStatus as string
                }
              />
            </span>
          );
        },
      },
    },
    {
      id: "kirStatus",
      type: "text",
      name: "kirStatus",
      disabled: true,
      dependency: {
        fields: [],
        label: () => {
          const _data = unitActivity?.pmCheckDetail?.data?.kirExpired;
          if (!_data) return t("input.kirStatus.label");

          return (
            <span>
              {t("input.kirStatus.label")}{" "}
              <StatusTag
                value={unitActivity?.pmCheckDetail?.data?.kirStatus as string}
              />
            </span>
          );
        },
      },
    },
    {
      id: "KM",
      type: "number",
      name: "KM",
      label: t("input.KM.label"),
      placeholder: t("input.KM.placeholder"),
      rules: [{ required: true, message: messageRequired }],
    },
  ] as ChildConfig[];

  useEffect(() => {
    if (isEmpty(unitActivity?.pmCheckDetail?.data)) return;

    const _data = unitActivity?.pmCheckDetail?.data;

    form.setFieldsValue({
      vehicleId: _data?.licensePlate,
      status: _data?.vehicleStatus === CONST_VEHICLE_STATUS[0],
      unitType: _data?.type?.name,
      vehicleDescription: _data?.vehicleDescription,
      branch: _data?.branchData?.[0]?.name,
      licenseStatus: _data?.licenseExpired,
      kirStatus: _data?.kirExpired,
    });

    if (_data?.acquisitionDate) {
      const _startDate = moment(_data?.acquisitionDate);
      const _endDate = moment();
      const _duration = moment.duration(_endDate.diff(_startDate));

      form.setFieldsValue({
        ageOfUnit: `${_duration?.years()} ${tGlobal("years")} ${_duration?.months()} ${tGlobal("months")} ${_duration?.days()} ${tGlobal("days")}`,
      });
    }
  }, [unitActivity?.pmCheckDetail?.data]);

  return (
    <Row gutter={[32, 16]}>
      <Col xs={24} lg={16}>
        <Card title={t("title")}>
          <RsFormBuilder
            name="form-km-check"
            layout="vertical"
            form={form}
            type="update"
            configs={FORM_CONFIG}
            onFinish={onSubmit}
            loading={loading}
            disabled={loading}
          />
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card
          title={t("history")}
          loading={loadingState[unitActivityTypes.GET_PM_CHECK_DETAIL]}
        >
          {KM_CHECK?.length > 0 ? (
            <Steps
              items={KM_CHECK}
              current={KM_CHECK?.length}
              direction="vertical"
              progressDot
            />
          ) : (
            <Empty />
          )}
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  loadingState: state.loading,
  unitActivity: state.unitActivity,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockManagementFormKMCheck);
