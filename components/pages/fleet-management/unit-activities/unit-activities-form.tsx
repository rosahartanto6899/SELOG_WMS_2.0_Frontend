/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Error404 from "@sera-components/error-boundary/Error404";
import { Refresh } from "@sera-components/icons";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  locationActions,
  RootState,
  stockManagementActions,
  unitActivityActions,
} from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { LocationState, locationTypes } from "@sera-types/location.type";
import {
  StockManagementState,
  stockManagementTypes,
} from "@sera-types/stock-management.type";
import {
  UnitActivityState,
  unitActivityTypes,
} from "@sera-types/unit-activity";
import {
  DATE_FORMAT,
  DATE_TO_FORM,
  FORMAT_DATE_TIME,
} from "@sera-utils/constants/common";
import { FormConfigHandler } from "@sera-utils/data-manipulator";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Empty, FormInstance, Row, Steps } from "antd";
import dayjs from "dayjs";
import { isEmpty, startCase, toLower } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const PAYLOAD = { page: 1, limit: 10 };
export const CONST_VEHICLE_STATUS = ["USP", "UTSP"];

interface UnitActivitiesFormProps {
  type: "create" | "detail" | "update";
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;

  loadingState: LoadingState;
  locations: LocationState;
  stockManagement: StockManagementState;
  unitActivity: UnitActivityState;
  getStock: typeof stockManagementActions.getStockFetch;
  getMaintenanceType: typeof unitActivityActions.getMaintenanceTypeFetch;
  getDropdownLocations: typeof locationActions.getDropdownLocationsFetch;
  getLastLocation: typeof unitActivityActions.getLastLocationFetch;
  getLocationCount: typeof unitActivityActions.getLocationCountFetch;
  getLastLocationClear: typeof unitActivityActions.getLastLocationClear;
  getLocationCountClear: typeof unitActivityActions.getLocationCountClear;
}

const UnitActivitiesForm = ({
  type,
  form,
  loading,
  onSubmit,
  loadingState,
  locations,
  stockManagement,
  unitActivity,
  getStock,
  getMaintenanceType,
  getDropdownLocations,
  getLastLocation,
  getLocationCount,
  getLastLocationClear,
  getLocationCountClear,
}: UnitActivitiesFormProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitActivities.form",
  });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/stock-management/form");

  const messageRequired = t("message.required");
  const messageInvalidDate = t("message.invalidDate");
  const messageInvalidLength = (_value: number) => {
    return t("input.message.invalidLength", { total: _value });
  };

  const [maintenance, setMaintenance] = useState({
    type: "",
    category: "",
    level: "",
  });

  const MAINTENANCE_TYPE = useMemo(() => {
    return unitActivity?.maintenanceType?.data ?? [];
  }, [unitActivity?.maintenanceType?.data]);

  const MAINTENANCE_CATEGORY = useMemo(() => {
    if (!maintenance?.type) return [];

    const _type = MAINTENANCE_TYPE?.find(
      (_item) => _item?.name === maintenance?.type,
    );

    return _type?.subTypes ?? [];
  }, [maintenance?.type]);

  const MAINTENANCE_LEVEL = useMemo(() => {
    if (!maintenance?.type || !maintenance?.category) return [];

    const _category = MAINTENANCE_TYPE?.find(
      (_item) => _item?.name === maintenance?.type,
    )?.subTypes?.find((_item) => _item?.name === maintenance?.category);

    return _category?.sla ?? [];
  }, [maintenance?.type, maintenance?.category]);

  const MAINTENANCE_PROGRESS = useMemo(() => {
    const _data = unitActivity?.unitDetail?.data;
    const _progress = _data?.dataMaintenance?.detailMaintenance;

    if (!_progress) return [];

    return _progress?.map((_item) => ({
      title: DATE_FORMAT(_item?.activityDateTime, "YYYY-MM-DD HH:mm") ?? "-",
      description: (
        <>
          <div>{_item?.activityDetail ?? "-"}</div>
          <div>{_item?.updatedByName || "-"}</div>
        </>
      ),
    }));
  }, [unitActivity?.unitDetail?.data?.dataMaintenance?.detailMaintenance]);

  const FORM_CONFIG = [
    {
      id: "vehicleId",
      type: type === "create" ? "select" : "text",
      name: "vehicleId",
      label: t("input.vehicleId.label"),
      placeholder: t("input.vehicleId.placeholder"),
      options: stockManagement?.data ?? [],
      valueField: "id",
      labelField: "licensePlate",
      rules: [{ required: type === "create", message: messageRequired }],
      disabled: type === "update",
      loading: loadingState[stockManagementTypes.GET_STOCK],
      onChange(_value) {
        form.resetFields(["status", "lastLocation"]);

        const _data = stockManagement?.data?.find(
          (_item) => _item?.id === _value,
        );

        if (_data) {
          form.setFieldsValue({
            status: _data?.status === CONST_VEHICLE_STATUS[0],
            unitType: _data?.unitType,
          });
          getLastLocation({ type: "form", vin: _data?.vin });
        }
      },
      onSearch(_value) {
        getStock({ ...PAYLOAD, searchBy: "licensePlate", search: _value });
      },
      onClear() {
        getStock(PAYLOAD);
      },
    },
    {
      id: "status",
      type: "switch",
      name: "status",
      label: t("input.status.label"),
      options: CONST_VEHICLE_STATUS,
      rules: [{ required: true, message: messageRequired }],
      dependency: {
        fields: ["vehicleId", "actualStartDate", "actualEndDate"],
        disabled: (_value) =>
          !_value?.vehicleId ||
          (_value?.actualStartDate && !_value?.actualEndDate),
      },
    },
    {
      id: "unitType",
      type: "text",
      name: "unitType",
      label: t("input.unitType.label"),
      disabled: true,
    },
    {
      id: "lastLocation",
      type: "text",
      name: "lastLocation",
      disabled: true,
      dependency: {
        fields: ["vehicleId"],
        label: (_value) => {
          let _data = undefined;
          let _error = undefined;

          if (type === "create") {
            _data = stockManagement?.data?.find(
              (_item) => _item?.id === _value?.vehicleId,
            );
          }

          if (type === "update") {
            _error = unitActivity?.lastLocation?.error;
          }

          return (
            <Row gutter={6}>
              <Col>{t("input.lastLocation.label")}</Col>

              <Col style={{ position: "relative" }}>
                <Button
                  style={{ position: "absolute" }}
                  id="get-last-location-button"
                  size="small"
                  tooltip={t("input.lastLocation.tooltip")}
                  icon={<Refresh />}
                  onClick={(_event) => {
                    _event?.preventDefault();

                    if (type === "create" && _data?.vin) {
                      getLastLocation({ type: "form", vin: _data?.vin });
                    }

                    if (
                      (type === "detail" || type === "update") &&
                      unitActivity?.unitDetail?.data?.dataVehicle?.vin
                    ) {
                      getLastLocation({
                        type: "form",
                        vin: unitActivity?.unitDetail?.data?.dataVehicle?.vin,
                      });
                    }
                  }}
                  disabled={
                    (type === "create" &&
                      _data?.statusObd !== "Failed" &&
                      _data?.statusObd !== "No OBD") ||
                    ((type === "detail" || type === "update") && !_error) ||
                    loadingState[unitActivityTypes.GET_LAST_LOCATION]
                  }
                />
              </Col>
            </Row>
          );
        },
      },
    },
    {
      id: "maintenanceType",
      type: "select",
      name: "maintenanceType",
      label: t("input.maintenanceType.label"),
      placeholder: t("input.maintenanceType.placeholder"),
      options: MAINTENANCE_TYPE,
      valueField: "name",
      labelField: "name",
      rules: [{ required: true, message: messageRequired }],
      loading: loadingState[unitActivityTypes.GET_MAINTENANCE_TYPE],
      onChange(_value) {
        form.resetFields([
          "maintenanceCategory",
          "maintenanceLevel",
          "bookingStartDate",
          "bookingEndDate",
        ]);

        setMaintenance({ type: _value, category: "", level: "" });
      },
    },
    {
      id: "maintenanceCategory",
      type: "select",
      name: "maintenanceCategory",
      label: t("input.maintenanceCategory.label"),
      placeholder: t("input.maintenanceCategory.placeholder"),
      options: MAINTENANCE_CATEGORY,
      valueField: "name",
      labelField: "name",
      rules: [{ required: true, message: messageRequired }],
      loading: loadingState[unitActivityTypes.GET_MAINTENANCE_TYPE],
      onChange(_value) {
        form.resetFields([
          "maintenanceLevel",
          "bookingStartDate",
          "bookingEndDate",
        ]);
        setMaintenance((_prev) => ({ ..._prev, category: _value, level: "" }));
      },
      dependency: {
        fields: ["maintenanceType"],
        disabled: (_value) => !_value?.maintenanceType,
      },
    },
    {
      id: "maintenanceLevel",
      type: "select",
      name: "maintenanceLevel",
      label: t("input.maintenanceLevel.label"),
      placeholder: t("input.maintenanceLevel.placeholder"),
      options: MAINTENANCE_LEVEL?.map((_level) => ({
        id: _level?.id,
        name: startCase(toLower(_level?.id)),
      })),
      valueField: "id",
      labelField: "name",
      rules: [{ required: true, message: messageRequired }],
      loading: loadingState[unitActivityTypes.GET_MAINTENANCE_TYPE],
      onChange(_value) {
        form.resetFields(["bookingStartDate", "bookingEndDate"]);
        setMaintenance((_prev) => ({ ..._prev, level: _value }));
      },
      dependency: {
        fields: ["maintenanceCategory"],
        disabled: (_value) => !_value?.maintenanceCategory,
      },
    },
    {
      id: "maintenanceLocationId",
      type: "select",
      name: "maintenanceLocationId",
      placeholder: t("input.maintenanceLocationId.placeholder"),
      options: locations?.dropdownLocations?.data ?? [],
      valueField: "id",
      labelField: "name",
      rules: [{ required: true, message: messageRequired }],
      disabled: loadingState[unitActivityTypes.LOCATION_COUNT],
      loading: loadingState[locationTypes.GET_DROPDOWN_LOCATIONS],
      onChange(_value) {
        getLocationCountClear();
        getLocationCount({ id: _value as string });
      },
      dependency: {
        fields: [],
        label: () => {
          const _data = unitActivity?.locationCount?.data?.dataLocationCount;

          return (
            <span>
              {t("input.maintenanceLocationId.label")} (
              <strong>{`${t("input.maintenanceLocationId.subLabel")}`}</strong>:{" "}
              {_data
                ? t("input.maintenanceLocationId.labelSuffix", { total: _data })
                : "-"}
              )
            </span>
          );
        },
      },
    },
    {
      id: "bookingStartDate",
      type: "date",
      name: "bookingStartDate",
      placeholder: t("input.bookingStartDate.placeholder"),
      format: "YYYY-MM-DD HH:mm",
      startDate: dayjs(new Date()),
      endDate: unitActivity?.unitDetail?.data?.dataMaintenance?.planStartDate
        ? dayjs(
            unitActivity?.unitDetail?.data?.dataMaintenance?.planStartDate,
          ).add(10, "days")
        : undefined,
      rules: [{ required: true, message: messageRequired }],
      disabled: Boolean(
        unitActivity?.unitDetail?.data?.dataMaintenance?.actualStartDate,
      ),
      onChange(_value) {
        form.setFieldsValue({
          bookingEndDate: dayjs(_value)?.add(
            unitActivity?.maintenanceType?.data
              ?.find((_item) => _item?.name === maintenance?.type)
              ?.subTypes?.find((_item) => _item?.name === maintenance?.category)
              ?.sla?.find((_item) => _item?.id === maintenance?.level)?.value ??
              0,
            "days",
          ),
        });
      },
      dependency: {
        fields: ["maintenanceLevel", "bookingStartDate"],
        label: (_value) => {
          const _format = "YYYY-MM-DD HH:mm";
          const _maintenance = unitActivity?.unitDetail?.data?.dataMaintenance;

          const _bookingStartDate = DATE_FORMAT(
            _value?.bookingStartDate,
            _format,
          );
          const _planStartDate = DATE_FORMAT(
            _maintenance?.planStartDate,
            _format,
          );

          if (type !== "create" && _bookingStartDate !== _planStartDate) {
            return (
              <span>
                {t("input.bookingStartDate.label")} (
                <strong>{`${t("input.planStartDate.label")}`}</strong>:{" "}
                {_planStartDate})
              </span>
            );
          }

          return t("input.bookingStartDate.label");
        },
        disabled: (_value) => !_value?.maintenanceLevel,
      },
    },
    {
      id: "bookingEndDate",
      type: "date",
      name: "bookingEndDate",
      placeholder: t("input.bookingEndDate.placeholder"),
      format: "YYYY-MM-DD HH:mm",
      startDate: dayjs(new Date()),
      rules: [
        { required: true, message: messageRequired },
        ({ getFieldValue }: Pick<FormInstance, "getFieldValue">) => ({
          validator(_: never, _value: dayjs.Dayjs) {
            const _bookingStartDate = getFieldValue("bookingStartDate");
            if (!_bookingStartDate || !_value) return Promise.resolve();

            const _startDate = dayjs(_bookingStartDate);
            const _endDate = dayjs(_value);

            if (!_endDate.isAfter(_startDate, "minute")) {
              return Promise.reject(new Error(messageInvalidDate));
            }

            return Promise.resolve();
          },
        }),
      ],
      disabled: Boolean(
        unitActivity?.unitDetail?.data?.dataMaintenance?.actualEndDate,
      ),
      dependency: {
        fields: ["bookingStartDate", "bookingEndDate"],
        label: (_value) => {
          const _format = "YYYY-MM-DD HH:mm";
          const _maintenance = unitActivity?.unitDetail?.data?.dataMaintenance;

          const _bookingEndDate = DATE_FORMAT(_value?.bookingEndDate, _format);
          const _planEndDate = DATE_FORMAT(_maintenance?.planEndDate, _format);

          if (type === "update" && _bookingEndDate !== _planEndDate) {
            return (
              <span>
                {t("input.bookingEndDate.label")} (
                <strong>{`${t("input.planEndDate.label")}`}</strong>:{" "}
                {_planEndDate})
              </span>
            );
          }

          return t("input.bookingEndDate.label");
        },
        disabled: (_value) => !_value?.bookingStartDate,
      },
    },
    {
      id: "actualStartDate",
      type: "date",
      name: "actualStartDate",
      label: t("input.actualStartDate.label"),
      placeholder: t("input.actualStartDate.placeholder"),
      format: "YYYY-MM-DD HH:mm",
      startDate: dayjs(new Date()),
      hidden: type === "create",
      onChange() {
        form.resetFields(["actualEndDate"]);
        form.setFieldsValue({ status: false });
      },
    },
    {
      id: "actualEndDate",
      type: "date",
      name: "actualEndDate",
      label: t("input.actualEndDate.label"),
      placeholder: t("input.actualEndDate.placeholder"),
      format: "YYYY-MM-DD HH:mm",
      startDate: dayjs(new Date()),
      hidden: type === "create",
      rules: [
        ({ getFieldValue }: Pick<FormInstance, "getFieldValue">) => ({
          validator(_: never, _value: dayjs.Dayjs) {
            const _bookingStartDate = getFieldValue("actualStartDate");
            if (!_bookingStartDate || !_value) return Promise.resolve();

            const _startDate = dayjs(_bookingStartDate);
            const _endDate = dayjs(_value);

            if (!_endDate.isAfter(_startDate, "minute")) {
              return Promise.reject(new Error(messageInvalidDate));
            }

            return Promise.resolve();
          },
        }),
      ],
      onChange() {
        form.setFieldsValue({ status: true });
      },
      dependency: {
        fields: ["actualStartDate"],
        disabled: (_value) => !_value?.actualStartDate,
      },
    },
    {
      id: "note",
      type: "textarea",
      name: "note",
      label: t("input.note.label"),
      placeholder: t("input.note.placeholder"),
      rules: [{ max: 200, message: messageInvalidLength(200) }],
      maxLength: 200,
      showCount: true,
    },
    {
      id: "maintenanceDetail",
      type: "dynamicInput",
      name: "maintenanceDetail",
      label: t("input.maintenanceDetail.label"),
      hidden: type !== "update",
      childConfigs: [
        {
          id: "activityDateTime",
          type: "date",
          name: "activityDateTime",
          label: t("input.activityDateTime.label"),
          placeholder: t("input.activityDateTime.placeholder"),
          format: "YYYY-MM-DD HH:mm",
          startDate: dayjs(new Date()),
        },
        {
          id: "activityDetail",
          type: "text",
          name: "activityDetail",
          label: t("input.activityDetail.label"),
          placeholder: t("input.activityDetail.placeholder"),
          rules: [{ max: 100, message: messageInvalidLength(100) }],
          maxLength: 100,
          showCount: true,
        },
      ],
    },
  ] as ChildConfig[];

  useEffect(() => {
    form.resetFields();
    getLastLocationClear();

    if (type === "detail") return;

    try {
      if (type === "create") getStock(PAYLOAD);

      getMaintenanceType();
      getDropdownLocations({ type: "Maintenance Location" });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 413, error);
      else sendErrorHandler("useEffect", 413, error?.data?.message);
    }
  }, []);

  useEffect(() => {
    const _data = unitActivity?.unitDetail?.data;
    if (type === "create" || isEmpty(_data)) return;

    const _maintenance = _data?.dataMaintenance;
    const _vehicle = _data?.dataVehicle;

    try {
      if (_vehicle?.vin) {
        getLastLocation({ type: "form", vin: _vehicle?.vin });
      }

      if (_maintenance?.maintenanceLocationId) {
        getLocationCount({ id: _maintenance?.maintenanceLocationId });
      }
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 512, error);
      else sendErrorHandler("useEffect", 512, error?.data?.message);
    }

    setMaintenance({
      type: _maintenance?.maintenanceType ?? "",
      category: _maintenance?.maintenanceCategory ?? "",
      level: _maintenance?.maintenanceLevel ?? "",
    });

    form.setFieldsValue({
      vehicleId: _vehicle?.licensePlate,
      status: _vehicle?.vehicleStatus === CONST_VEHICLE_STATUS[0],
      unitType: _vehicle?.type?.name,
      maintenanceType: _maintenance?.maintenanceType,
      maintenanceCategory: _maintenance?.maintenanceCategory,
      maintenanceLocationId: _maintenance?.maintenanceLocationId,
      note: _maintenance?.note,

      ...(type === "update"
        ? {
            maintenanceLevel: _maintenance?.maintenanceLevel,
            bookingStartDate: DATE_TO_FORM(
              _maintenance?.bookingStartDate ?? _maintenance?.planStartDate,
            ),
            bookingEndDate: DATE_TO_FORM(
              _maintenance?.bookingEndDate ?? _maintenance?.planEndDate,
            ),
            actualStartDate: DATE_TO_FORM(_maintenance?.actualStartDate),
            actualEndDate: DATE_TO_FORM(_maintenance?.actualEndDate),
          }
        : {
            maintenanceLevel: startCase(
              toLower(_maintenance?.maintenanceLevel),
            ),
            bookingStartDate: DATE_FORMAT(
              _maintenance?.bookingStartDate ?? _maintenance?.planStartDate,
              FORMAT_DATE_TIME,
            ),
            bookingEndDate: DATE_FORMAT(
              _maintenance?.bookingEndDate ?? _maintenance?.planEndDate,
              FORMAT_DATE_TIME,
            ),
            actualStartDate: DATE_FORMAT(
              _maintenance?.actualStartDate,
              FORMAT_DATE_TIME,
            ),
            actualEndDate: DATE_FORMAT(
              _maintenance?.actualEndDate,
              FORMAT_DATE_TIME,
            ),
            maintenanceLocationId: _data?.maintenanceLocationName,
          }),
    });
  }, [unitActivity?.unitDetail?.data]);

  useEffect(() => {
    const _data = unitActivity?.lastLocation?.data;
    if (isEmpty(_data)) return;

    form.setFieldsValue({ lastLocation: _data?.lastLocation });
    getLastLocationClear();
  }, [unitActivity?.lastLocation?.data]);

  useEffect(() => {
    if (isEmpty(unitActivity?.lastLocation?.error)) return;

    form.resetFields(["lastLocation"]);
    if (type === "create") getLastLocationClear();
  }, [unitActivity?.lastLocation?.error]);

  useEffect(() => {
    if (type !== "create") return;
    setFormErrorHandle(form, unitActivity?.createMaintenance?.error);
  }, [unitActivity?.createMaintenance?.error]);

  useEffect(() => {
    if (type !== "update") return;
    setFormErrorHandle(form, unitActivity?.updateMaintenance?.error);
  }, [unitActivity?.updateMaintenance?.error]);

  useEffect(() => {
    setFormErrorHandle(form, unitActivity?.lastLocation?.error);
  }, [unitActivity?.lastLocation?.error]);

  if (!isEmpty(unitActivity?.unitDetail?.error)) return <Error404 />;

  return (
    <Row gutter={[32, 16]}>
      <Col {...(type !== "create" ? { xs: 24, lg: 16 } : { span: 24 })}>
        <Card
          {...(type === "create" ? { title: t("title.add") } : {})}
          {...(type === "detail" ? { title: t("title.detail") } : {})}
          {...(type === "update" ? { title: t("title.edit") } : {})}
        >
          <RsFormBuilder
            name="form-unit-activities"
            layout="vertical"
            form={form}
            type={type}
            configs={FormConfigHandler(FORM_CONFIG, type === "detail")}
            onFinish={onSubmit}
            loading={loading}
            disabled={loading}
          />
        </Card>
      </Col>

      {type !== "create" ? (
        <Col xs={24} lg={8}>
          <Card
            title={t("history.maintenanceProgress")}
            loading={loadingState[unitActivityTypes.GET_UNIT_DETAIL]}
          >
            {MAINTENANCE_PROGRESS?.length > 0 ? (
              <Steps
                items={MAINTENANCE_PROGRESS}
                current={MAINTENANCE_PROGRESS?.length}
                direction="vertical"
                progressDot
              />
            ) : (
              <Empty />
            )}
          </Card>
        </Col>
      ) : null}
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  loadingState: state.loading,
  locations: state.locations,
  stockManagement: state.stockManagement,
  unitActivity: state.unitActivity,
});

const mapDispatchToProps = {
  getStock: stockManagementActions.getStockFetch,
  getMaintenanceType: unitActivityActions.getMaintenanceTypeFetch,
  getDropdownLocations: locationActions.getDropdownLocationsFetch,
  getLastLocation: unitActivityActions.getLastLocationFetch,
  getLocationCount: unitActivityActions.getLocationCountFetch,
  getLastLocationClear: unitActivityActions.getLastLocationClear,
  getLocationCountClear: unitActivityActions.getLocationCountClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(UnitActivitiesForm);
