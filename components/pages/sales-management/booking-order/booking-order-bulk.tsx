/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import { DeleteOutlined } from "@sera-components/icons";
import Input from "@sera-components/input";
import InputLookUp, {
  OnChangeLookUpProps,
} from "@sera-components/input-lookup";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import BookingOrderApi from "@sera-libraries/api/booking-order";
import CustomerContractApi from "@sera-libraries/api/customer-contract";
import DriversApi from "@sera-libraries/api/drivers";
import StockManagementApi from "@sera-libraries/api/stock-management";
import MessageHandler from "@sera-libraries/message-handler";
import {
  stockManagementActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { driversActions } from "@sera-redux/slices/drivers.slice";
import { BaseType } from "@sera-types/base.type";
import {
  BookingShipmentStatus,
  DriverRecord as BookingOrderDriverRecord,
  LicensePlateRecord,
  RouteJourneyRecord,
} from "@sera-types/booking-order.type";
import { Contract } from "@sera-types/customer-contract.type";
import { DriverRecord, driversTypes } from "@sera-types/drivers.type";
import { stockManagementTypes } from "@sera-types/stock-management.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { Col, Divider, Form, Row, Space, TimePicker } from "antd";
import { FormInstance } from "antd/lib";
import dayjs from "dayjs";
import { isEqualWith, isNil, uniqBy } from "lodash";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { ModalFormProps } from "./booking-form";
import styles from "./booking-order.module.scss";
import {
  DriverColumns,
  LicensePlateColumns,
  RouteColumns,
} from "./booking-props-table";

interface BookingOrderBulkProps {
  form: FormInstance;
  disabled: boolean;
  shipmentType?: string;
  setModalForm: Dispatch<SetStateAction<ModalFormProps>>;
  type: string;
}

const BookingOrderBulk: FC<BookingOrderBulkProps> = ({
  form,
  disabled,
  shipmentType,
  type,
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "bookingOrder.form" });
  const IS_RITASE = shipmentType?.toLowerCase() === "ritase";
  const IS_DEDICATED = shipmentType?.toLowerCase() === "dedicated";
  const dispatch = useAppDispatch();
  const requiredMessage = "";
  const IS_EDIT = type === "edit";
  const IS_DETAIL = type === "detail";

  const { detailBooking } = useAppSelector((state) => state.bookingOrder);

  const [vehicleInitValue, setVehicleInitValue] = useState<{
    key: string;
    rows: any;
  }>({
    key: "",
    rows: null,
  });

  const [driverInitValue, setDriverInitValue] = useState<
    Record<string, { key: string; rows: any }>
  >({});
  const [disableDriver, setDisableDriver] = useState(false);

  const {
    shipmentDetails,
    pickUpDate,
    customerName,
    // branchOrder
  } = Form.useWatch([], form) || {};

  const { dropdownCustomerRoutes, detailCustomerRoute } = useAppSelector(
    (state) => state.customerRoutes,
  );
  const { data: vehiclesStock, options: vehicleStockOptions } = useAppSelector(
    (state) => state.stockManagement,
  );
  const { data: driversList, options: driversOptions } = useAppSelector(
    (state) => state.drivers,
  );
  const loading = useAppSelector((state) => state.loading);

  const MAPPED_LICENSE_PLATE =
    vehiclesStock?.map((v, i) => ({
      no:
        ((vehicleStockOptions?.page ?? 1) - 1) *
          (vehicleStockOptions?.limit ?? 5) +
        i +
        1,
      licensePlate: v.licensePlate,
      vehicleYear: v.vehicleYear,
      planRegMaintenance: v.planRegMaintenance,
      licenseExpired: v.licenseExpired,
      kirExpired: v.kirExpired,
      id: v.id,
    })) || [];

  const MAPPED_DRIVERS_LIST = driversList
    // .filter((v) => v.shipmentType.toLowerCase() === shipmentType?.toLowerCase()) // TODO: NEED CONFIRM
    .map((v, i) => ({
      no:
        ((driversOptions?.page ?? 1) - 1) * (driversOptions?.limit ?? 5) +
        i +
        1,
      driverName: v.employeeName,
      driverId: v.employeeId,
      simType: v.licenseType,
      age: dayjs().diff(dayjs(v.birthDate, "YYYY-MM-DD"), "years") || null,
      phoneNumber: v.mobilePhone,
      employeeStatus: v.employeeStatus,
      resignDate: v.resignDate,
      id: v.id,
    }));
  const MAPPED_CUSTOMER_ROUTE = (dropdownCustomerRoutes.data || []).map(
    (v) => ({
      ...v,
      label: v.originalRouteCode,
      value: v.id,
      disabled: !v.jmpStatus || !v.expenseStatus,
    }),
  );

  const handleOnChangeLookUp = (
    v: unknown,
    type: "driver" | "licensePlate",
    index: number,
    indexDriver?: number,
  ) => {
    if (type === "driver" && !isNil(indexDriver)) {
      const value = v as OnChangeLookUpProps<BookingOrderDriverRecord>;
      form.setFieldValue(
        ["shipmentDetails", index, "drivers", indexDriver],
        value.key,
      );
      form.validateFields([["shipmentDetails", index, "drivers", indexDriver]]);
    }

    if (type === "licensePlate") {
      const value = v as OnChangeLookUpProps<LicensePlateRecord>;
      form.setFieldValue(["shipmentDetails", index, "licensePlate"], value.key);
      form.validateFields([["shipmentDetails", index, "licensePlate"]]);
    }
  };

  const licensePlateColumns = LicensePlateColumns();
  const driverColumns = DriverColumns();
  const routeColumns = RouteColumns();

  const driverValue = (index: number, indexDriver: number) => {
    const driversValue = (
      (form.getFieldValue(["shipmentDetails", index, "drivers"]) ||
        []) as string[]
    )?.filter(Boolean);

    const currentValue = form.getFieldValue([
      "shipmentDetails",
      index,
      "drivers",
      indexDriver,
    ]);

    return driversValue.filter((o) => o !== currentValue);
  };

  const getTypeUnit = async (v: string, index: number) => {
    form.resetFields([["shipmentDetails", index, "pickupHour"]]);
    if (!v) return;
    if (IS_RITASE) return;
    const { contractId, vehicleTypeName } =
      MAPPED_CUSTOMER_ROUTE.find((o) => o.customerRouteId === v) || {};
    try {
      const { data } = await CustomerContractApi().getDetailContract({
        id: contractId,
      });

      const _data = data.data as Contract;
      const materials =
        _data.materials?.find((o) => o.vehicleTypeName === vehicleTypeName) ||
        {};
      if (!materials?.vehicleTypeId || materials?.vehicleTypeId === "-") {
        MessageHandler().error({ content: "Vehicle type is not available" });
        return;
      }
      form.setFieldValue(
        ["shipmentDetails", index, "typeUnit"],
        materials?.vehicleTypeId,
      );
    } catch (_error: unknown) {
      captureErrorAxios(_error);
    }
  };

  const handleDisabledTime = (index: number, selectedDate: dayjs.Dayjs) => {
    const shipments = form.getFieldValue(["shipmentDetails"]);
    const currentCustRouteId = form.getFieldValue([
      "shipmentDetails",
      index,
      "customerRouteId",
    ]);

    const _pickupDate = pickUpDate as dayjs.Dayjs;
    const isToday = _pickupDate?.isSame(dayjs(), "day") || false;
    const currentHour = dayjs().add(2, "hours").hour();

    const isArr = Array.isArray(shipments);

    if (!isArr || !shipments?.length) return {};

    const disabledHours = () => {
      const hours: number[] = [];

      // disable past hour if pickup date is today
      if (isToday) {
        for (let i = 0; i < currentHour; i++) {
          hours.push(i);
        }
      }

      // disable hour if already used in the same route
      shipments.forEach((shipment, idx) => {
        const pHour = shipment?.pickupHour;
        const custRouteId = shipment?.customerRouteId;
        if (idx !== index && pHour) {
          if (custRouteId === currentCustRouteId) {
            hours.push(dayjs(pHour).hour());
          }
        }
      });

      return uniqBy(hours, (hour) => hour);
    };

    const isSelectedHour = selectedDate.hour();
    const isCurrentSelectedHour = currentHour === isSelectedHour;

    const disabledMinutes = () => {
      const minutes: number[] = [];

      // disable past minute if pickup date is today
      if (isToday && isCurrentSelectedHour) {
        const currentMinute = dayjs().minute();

        for (let i = 0; i <= currentMinute; i++) {
          minutes.push(i);
        }
      }

      return minutes;
    };

    return {
      disabledHours,
      disabledMinutes,
    };
  };

  const getRouteJourney = (index: number): RouteJourneyRecord[] => {
    const routeId = form.getFieldValue([
      "shipmentDetails",
      index,
      "customerRouteId",
    ]);

    if (!routeId) {
      return [];
    }
    let route = {
      origin: "",
      detailOrigin: "",
      destination: "",
      detailDestination: "",
    };
    if (!IS_DETAIL) {
      route = MAPPED_CUSTOMER_ROUTE.find(
        (o) => o.customerRouteId === routeId,
      ) as any;
    } else {
      const loading =
        detailCustomerRoute?.data?.details?.find(
          (o) => o.routeActivityType === "Loading",
        ) || {};
      const unloading =
        detailCustomerRoute?.data?.details?.find(
          (o) => o.routeActivityType === "Unloading",
        ) || {};
      route = {
        origin: loading?.locationName || "",
        detailOrigin: loading?.locationAddress || "",
        destination: unloading?.locationName || "",
        detailDestination: unloading?.locationAddress || "",
      };
    }

    return [
      {
        no: 1,
        type: "Origin",
        location: route?.origin || "-",
        address: route?.detailOrigin || "-",
      },
      {
        no: 2,
        type: "Destination",
        location: route?.destination || "-",
        address: route?.detailDestination || "-",
      },
    ];
  };

  const getVehicleList = (index: number, options: BaseType) => {
    const unitTypeId = form.getFieldValue([
      "shipmentDetails",
      index,
      "typeUnit",
    ]);
    const customerName = form.getFieldValue("customerName");

    const params = {
      ...options,
      unitTypeId: unitTypeId ? [unitTypeId] : undefined,
      customerId: customerName ? [customerName] : undefined,
    };
    dispatch(stockManagementActions.getStockFetch(params));
  };

  const getVehicleDetail = async () => {
    const id = detailBooking.data.shipmentDetail?.vehicleId;
    try {
      const res = await StockManagementApi().detailVehicle({
        id,
      });

      if (res.data) {
        const data = res.data?.data;
        const value = {
          no: 1,
          licensePlate: data.licensePlate,
          vehicleYear: data.vehicleYear,
          planRegMaintenance: data.planRegMaintenance,
          licenseExpired: data.licenseExpired,
          kirExpired: data.kirExpired,
          id: data.id,
        };
        setVehicleInitValue({ key: value.id, rows: value });
      }
    } catch (error) {
      captureErrorAxios(error);
      return undefined;
    }
  };

  const getDriversList = (options: BaseType) => {
    const params = {
      ...options,
      // branchId: branchOrder ? branchOrder : undefined,
      customerId: customerName ? customerName : undefined,
    };

    dispatch(driversActions.getDriversFetch(params));
  };

  const getDriverDetail = async (driverId: string) => {
    try {
      const res = await DriversApi().detailDriver({
        id: driverId,
      });
      if (res.data) {
        const data = res.data?.data;
        const value = {
          no: 1,
          driverName: data.employeeName,
          driverId: data.employeeId,
          simType: data.licenseType,
          age:
            dayjs().diff(dayjs(data.birthDate, "YYYY-MM-DD"), "years") || null,
          phoneNumber: data.phone,
          employeeStatus: data.employeeStatus,
          id: data.id,
        };
        setDriverInitValue((prev) => ({
          ...prev,
          [driverId]: {
            key: value.id,
            rows: value,
          },
        }));
      }
    } catch (error) {
      captureErrorAxios(error);
      setDriverInitValue((prev) => ({
        ...prev,
        [driverId]: {
          key: "",
          rows: null,
        },
      }));
    }
  };

  const [shipmentStatus, setShipmentStatus] = useState<{
    loading: boolean;
    value: string;
    error?: string;
  }>({ loading: false, value: "" });

  const getShipmentStatus = async (
    key: string,
    row: unknown,
    type: "driver" | "licensePlate",
    index: number,
  ) => {
    setShipmentStatus({ value: "", loading: true });
    setDisableDriver(false);
    const pickUpHour = form.getFieldValue([
      "shipmentDetails",
      index,
      "pickupHour",
    ]);

    const missingFields: string[] = [];

    if (!pickUpDate) missingFields.push("pick up date");
    if (!pickUpHour) missingFields.push("pick up hour");

    if (!pickUpHour || !pickUpDate) {
      if (type === "driver") setDisableDriver(true);

      setShipmentStatus({
        value: "",
        loading: false,
        error: t("input.messagePickupDate", {
          value: missingFields.join(" and "),
        }),
      });
      return;
    }

    // Validate ETA against driver resignation date
    if (type === "driver") {
      const { resignDate } = row as DriverRecord;

      const etaValue = form.getFieldValue(["shipmentDetails", index, "eta"]);
      if (!etaValue) return;

      if (!isNil(resignDate)) {
        const resignationDate = dayjs(resignDate, "YYYY-MM-DD");
        const eta = dayjs(etaValue, "DD-MM-YYYY HH:mm");

        if (eta.isAfter(resignationDate)) {
          setDisableDriver(true);
          setShipmentStatus({
            value: "",
            loading: false,
            error: t("input.messageResignDate"),
          });
          return;
        }
      }
    }

    try {
      let res;
      if (type === "driver") {
        res = await BookingOrderApi().getShipmentStatusDriver({
          driverId: key,
          pickUpDate: dayjs(pickUpDate).format("YYYY-MM-DD"),
          pickUpHour: dayjs(pickUpHour).format("HH:mm"),
        });
      } else if (type === "licensePlate") {
        res = await BookingOrderApi().getShipmentStatusVehicle({
          vehicleId: key,
          pickUpDate: dayjs(pickUpDate).format("YYYY-MM-DD"),
          pickUpHour: dayjs(pickUpHour).format("HH:mm"),
        });
      }
      const _data = res?.data?.data as BookingShipmentStatus;
      setShipmentStatus((prev) => ({ ...prev, value: _data.status! }));
    } catch (error) {
      captureErrorAxios(error);
    } finally {
      setShipmentStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  const renderAdditionalInformation = (index: number) => {
    const { loading, error, value } = shipmentStatus || {};

    if (loading) return <span>Loading...</span>;
    if (error) return <span style={{ color: "red" }}>{error}</span>;
    if (!value) return null;

    const pickUpHour = form.getFieldValue([
      "shipmentDetails",
      index,
      "pickupHour",
    ]);

    const formattedPickup = `${dayjs(pickUpDate).format("DD-MM-YYYY")} ${dayjs(
      pickUpHour,
    ).format("HH:mm")}`;

    return (
      <span>
        {t("input.messageAdditionalInformation", {
          pickupDate: formattedPickup,
        })}
        : <span style={{ fontWeight: "bold" }}>{value}</span>
      </span>
    );
  };

  const handlePickupHour = (eta: dayjs.Dayjs, time: dayjs.Dayjs) => {
    const hours = time.hour();
    const minutes = time.minute();

    const updatedEta = eta.add(hours, "hour").add(minutes, "minute");

    return updatedEta;
  };

  useEffect(() => {
    const id = detailBooking?.data?.id;
    const isDedicated =
      detailBooking?.data?.shipmentType?.toLowerCase() === "dedicated";

    if (!id || !isDedicated) return;
    getVehicleDetail();

    return () => {
      setVehicleInitValue({ key: "", rows: null });
    };
  }, [detailBooking?.data?.id, detailBooking?.data?.shipmentType]);

  useEffect(() => {
    const id = detailBooking?.data?.id;
    const shipmentType = detailBooking?.data?.shipmentType;
    const drivers = detailBooking?.data?.shipmentDetail?.drivers;

    const isDedicated = shipmentType?.toLowerCase() === "dedicated";

    if (!id || !isDedicated) return;

    if (Array.isArray(drivers)) {
      drivers.forEach((driverId) => {
        getDriverDetail(driverId);
      });
    }
  }, [
    detailBooking?.data?.id,
    detailBooking?.data?.shipmentType,
    detailBooking?.data?.shipmentDetail?.drivers,
  ]);

  // calculate estimated time arrived
  useEffect(() => {
    if (!pickUpDate) return;
    if (!shipmentDetails?.length) return;
    // if (!dropdownCustomerRoutes.data?.length) return;

    const shipments = shipmentDetails as any[];

    const updated = shipments.map((item, idx) => {
      let eta = pickUpDate as dayjs.Dayjs;
      const routeId = shipments?.[idx]?.customerRouteId || "";
      const pickupHour = shipments?.[idx]?.pickupHour as null | dayjs.Dayjs;

      if (pickupHour) {
        eta = handlePickupHour(eta, pickupHour);
      }
      let r: any = {
        leadtimeValue: null,
        leadtimeType: null,
      };

      if (IS_DETAIL) {
        r = {
          leadtimeType: detailCustomerRoute.data?.header?.leadtimeType,
          leadtimeValue: detailCustomerRoute.data?.header?.leadtimeValue,
        };
      } else {
        r = dropdownCustomerRoutes?.data?.find(
          (o) => o.customerRouteId === routeId,
        ) as any;
      }

      if (r && r.leadtimeValue != null && r.leadtimeType != null) {
        eta = eta.add(
          r.leadtimeValue,
          r.leadtimeType as unknown as dayjs.ManipulateType,
        );
      }

      return {
        ...item,
        eta: eta.format("YYYY-MM-DD HH:mm"),
      };
    });

    if (!isEqualWith(updated, shipmentDetails)) {
      form.setFieldsValue({ shipmentDetails: updated });
    }
  }, [
    pickUpDate,
    shipmentDetails,
    dropdownCustomerRoutes?.data,
    IS_DETAIL,
    detailCustomerRoute.data,
  ]);

  return (
    <Form form={form} layout="vertical" disabled={disabled} autoComplete="off">
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Form.List name="shipmentDetails">
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(({ key, name, ...rest }) => (
                    <Form.Item
                      label={name === 0 ? "Detail Order" : ""}
                      required={false}
                      key={key}
                    >
                      <Row>
                        <Col span={24}>
                          <Card
                            key={key}
                            noShadow
                            style={{ border: "1px solid #3A8DDB61" }}
                          >
                            {!disabled && !IS_EDIT && (
                              <button
                                type="button"
                                className={styles["button-delete"]}
                                onClick={() => {
                                  remove(name);
                                }}
                              >
                                <DeleteOutlined color="red" />
                              </button>
                            )}
                            <Row gutter={[16, 16]}>
                              <Col lg={6} md={12} span={24}>
                                <Form.Item
                                  {...rest}
                                  label={t(
                                    "input.shipmentDetails.customerRouteId.label",
                                  )}
                                  rules={[
                                    {
                                      required: true,
                                      message: requiredMessage,
                                    },
                                  ]}
                                  name={[name, "customerRouteId"]}
                                >
                                  <Select
                                    options={uniqBy(
                                      [
                                        ...MAPPED_CUSTOMER_ROUTE,
                                        ...(IS_DETAIL
                                          ? [
                                              {
                                                label:
                                                  detailBooking?.data
                                                    ?.shipmentDetail
                                                    ?.routeCode ?? "-",
                                                value:
                                                  detailBooking?.data
                                                    ?.shipmentDetail
                                                    ?.customerRouteId ?? "",
                                              },
                                            ]
                                          : []),
                                      ],
                                      "value",
                                    )}
                                    onChange={(v) => {
                                      getTypeUnit(v, name);
                                    }}
                                    optionFilterProp="label"
                                    placeholder={t(
                                      "input.shipmentDetails.customerRouteId.placeholder",
                                    )}
                                  />
                                </Form.Item>
                              </Col>
                              <Col lg={4} md={12} span={24}>
                                <Form.Item
                                  {...rest}
                                  label={
                                    <p
                                      title={t(
                                        "input.shipmentDetails.pickupHour.label",
                                      )}
                                      className={
                                        styles["custom-label-form-item"]
                                      }
                                    >
                                      {t(
                                        "input.shipmentDetails.pickupHour.label",
                                      )}
                                    </p>
                                  }
                                  rules={[
                                    {
                                      required: true,
                                      message: requiredMessage,
                                    },
                                  ]}
                                  name={[name, "pickupHour"]}
                                >
                                  <TimePicker
                                    disabledTime={(date) =>
                                      handleDisabledTime(name, date)
                                    }
                                    inputReadOnly
                                    format="HH:mm"
                                    style={{ borderRadius: 20, width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>
                              {IS_RITASE && (
                                <Col lg={3} md={12} span={24}>
                                  <Form.Item
                                    {...rest}
                                    label={
                                      <p
                                        title={t(
                                          "input.shipmentDetails.qtyUnit.label",
                                        )}
                                        className={
                                          styles["custom-label-form-item"]
                                        }
                                      >
                                        {t(
                                          "input.shipmentDetails.qtyUnit.label",
                                        )}
                                      </p>
                                    }
                                    rules={[
                                      {
                                        required: IS_RITASE,
                                        message: requiredMessage,
                                      },
                                      {
                                        validator: (_, value) => {
                                          if (value) {
                                            if (value < 1) {
                                              return Promise.reject(
                                                t("input.minimumQty"),
                                              );
                                            }

                                            if (value > 100) {
                                              return Promise.reject(
                                                t("input.maximumQtyUnit"),
                                              );
                                            }
                                          }
                                          return Promise.resolve();
                                        },
                                      },
                                    ]}
                                    name={[name, "qtyUnit"]}
                                  >
                                    <Input
                                      type="number"
                                      min={1}
                                      name={t(
                                        "input.shipmentDetails.qtyUnit.label",
                                      )}
                                      placeholder={t(
                                        "input.shipmentDetails.qtyUnit.placeholder",
                                      )}
                                    />
                                  </Form.Item>
                                </Col>
                              )}
                              {IS_DEDICATED && (
                                <Col lg={3} md={12} span={24}>
                                  <Row>
                                    <Col span={24}>
                                      <Form.Item
                                        {...rest}
                                        label={
                                          <p
                                            title={t(
                                              "input.shipmentDetails.qtyDriver.label",
                                            )}
                                            className={
                                              styles["custom-label-form-item"]
                                            }
                                          >
                                            {t(
                                              "input.shipmentDetails.qtyDriver.label",
                                            )}
                                          </p>
                                        }
                                        rules={[
                                          {
                                            required: true,
                                            message: requiredMessage,
                                          },
                                          {
                                            validator: (_, value) => {
                                              if (value) {
                                                if (value > 2) {
                                                  return Promise.reject(
                                                    t("input.maximumQtyDriver"),
                                                  );
                                                }

                                                if (value < 1) {
                                                  return Promise.reject(
                                                    t("input.minimumQty"),
                                                  );
                                                }
                                              }
                                              return Promise.resolve();
                                            },
                                          },
                                        ]}
                                        name={[name, "qtyDriver"]}
                                      >
                                        <Input
                                          type="number"
                                          name={"qtyDriver"}
                                          min={0}
                                          onChange={(e) => {
                                            const val =
                                              Number(e.target.value) || 0;

                                            if (val > 2) return;

                                            form.resetFields([
                                              [
                                                "shipmentDetails",
                                                name,
                                                "drivers",
                                              ],
                                            ]);

                                            if (!val) return;
                                            form.setFieldValue(
                                              [
                                                "shipmentDetails",
                                                name,
                                                "drivers",
                                              ],
                                              Array.from({
                                                length: val,
                                              }).fill(undefined),
                                            );
                                          }}
                                          placeholder={t(
                                            "input.shipmentDetails.qtyDriver.placeholder",
                                          )}
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Col>
                              )}
                              <Col lg={5} md={12} span={24}>
                                <Form.Item
                                  {...rest}
                                  label={t("input.shipmentDetails.eta.label")}
                                  rules={[
                                    {
                                      required: false,
                                      message: requiredMessage,
                                    },
                                  ]}
                                  name={[name, "eta"]}
                                >
                                  <Input
                                    disabled
                                    name={t("input.shipmentDetails.eta.label")}
                                    placeholder={t(
                                      "input.shipmentDetails.eta.placeholder",
                                    )}
                                  />
                                </Form.Item>
                              </Col>
                              <Col lg={6} md={12} span={24}>
                                <Form.Item
                                  {...rest}
                                  label={t("input.shipmentDetails.notes.label")}
                                  rules={[
                                    {
                                      required: false,
                                      message: requiredMessage,
                                    },
                                  ]}
                                  name={[name, "notes"]}
                                >
                                  <Input
                                    name={t(
                                      "input.shipmentDetails.notes.label",
                                    )}
                                    placeholder={t(
                                      "input.shipmentDetails.notes.placeholder",
                                    )}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            {/* ADDITIONAL INFORMATION */}
                            {shipmentDetails?.[name]?.customerRouteId && (
                              <>
                                <Divider />
                                <Row gutter={[24, 24]}>
                                  <Col lg={IS_DEDICATED ? 12 : 24} span={24}>
                                    <Table
                                      columns={routeColumns}
                                      title={t("title.summaryRouteLocation")}
                                      scroll={{ x: "max-content" }}
                                      dataSource={getRouteJourney(name)}
                                      isCustomSearch={false}
                                      showActions={false}
                                    />
                                  </Col>
                                  {IS_DEDICATED && (
                                    <Col lg={6} md={12} span={24}>
                                      <Form.Item
                                        {...rest}
                                        label={t(
                                          "input.shipmentDetails.licensePlate.label",
                                        )}
                                        rules={[
                                          {
                                            required: IS_DEDICATED,
                                            message: requiredMessage,
                                          },
                                        ]}
                                        name={[name, "licensePlate"]}
                                      >
                                        <InputLookUp
                                          title={t("title.licensePlate")}
                                          placeholder={t(
                                            "input.shipmentDetails.licensePlate.placeholder",
                                          )}
                                          fieldValue={form.getFieldValue([
                                            "shipmentDetails",
                                            name,
                                            "licensePlate",
                                          ])}
                                          disabled={
                                            loading[
                                              stockManagementTypes.GET_STOCK
                                            ]
                                          }
                                          getData={(options) => {
                                            setShipmentStatus({
                                              loading: false,
                                              value: "",
                                            });
                                            getVehicleList(name, options);
                                          }}
                                          initialValue={vehicleInitValue}
                                          handleClearData={() =>
                                            dispatch(
                                              stockManagementActions.getStockClear(),
                                            )
                                          }
                                          searchByData={"licensePlate"}
                                          placeholderSearch="Input license plate"
                                          showSizeChanger={false}
                                          loading={
                                            loading[
                                              stockManagementTypes.GET_STOCK
                                            ]
                                          }
                                          onAsyncChange={(key, row) =>
                                            getShipmentStatus(
                                              key,
                                              row,
                                              "licensePlate",
                                              name,
                                            )
                                          }
                                          additionalInformationRender={() =>
                                            renderAdditionalInformation(name)
                                          }
                                          dataOptions={vehicleStockOptions}
                                          columns={licensePlateColumns}
                                          data={MAPPED_LICENSE_PLATE}
                                          rowKey="id"
                                          asValue="licensePlate"
                                          onChange={(v) =>
                                            handleOnChangeLookUp(
                                              v,
                                              "licensePlate",
                                              name,
                                            )
                                          }
                                        />
                                      </Form.Item>
                                    </Col>
                                  )}
                                  {IS_DEDICATED && (
                                    <Col lg={6} md={12} span={24}>
                                      <Form.List name={[name, "drivers"]}>
                                        {(drivers) => {
                                          return drivers.map(
                                            (
                                              {
                                                key: keyDriver,
                                                name: nameDriver,
                                                ...restDriver
                                              },
                                              indexDriver,
                                            ) => (
                                              <Form.Item
                                                key={keyDriver}
                                                {...restDriver}
                                                label={t(
                                                  "input.shipmentDetails.driver.label",
                                                  {
                                                    value: indexDriver + 1,
                                                  },
                                                )}
                                                rules={[
                                                  {
                                                    required: IS_DEDICATED,
                                                    message: requiredMessage,
                                                  },
                                                ]}
                                                name={nameDriver}
                                              >
                                                <InputLookUp
                                                  key={`input_lookup_${indexDriver}_driver`}
                                                  title={t("title.driver", {
                                                    value: indexDriver + 1,
                                                  })}
                                                  loading={
                                                    loading[
                                                      driversTypes.GET_DRIVERS
                                                    ]
                                                  }
                                                  disabled={
                                                    loading[
                                                      driversTypes.GET_DRIVERS
                                                    ] || disableDriver
                                                  }
                                                  placeholder={t(
                                                    "input.shipmentDetails.driver.placeholder",
                                                  )}
                                                  fieldValue={form.getFieldValue(
                                                    [
                                                      "shipmentDetails",
                                                      name,
                                                      "drivers",
                                                      nameDriver,
                                                    ],
                                                  )}
                                                  getData={(options) => {
                                                    setShipmentStatus({
                                                      loading: false,
                                                      value: "",
                                                    });
                                                    getDriversList(options);
                                                  }}
                                                  initialValue={
                                                    driverInitValue[
                                                      form.getFieldValue([
                                                        "shipmentDetails",
                                                        name,
                                                        "drivers",
                                                        nameDriver,
                                                      ])
                                                    ]
                                                  }
                                                  searchByData={"employeeName"}
                                                  placeholderSearch="Input driver name"
                                                  handleClearData={() =>
                                                    dispatch(
                                                      driversActions.getDriversClear(),
                                                    )
                                                  }
                                                  columns={driverColumns}
                                                  data={MAPPED_DRIVERS_LIST}
                                                  dataOptions={driversOptions}
                                                  showSizeChanger={false}
                                                  rowKey="id"
                                                  asValue="driverName"
                                                  disabledValue={driverValue(
                                                    name,
                                                    nameDriver,
                                                  )}
                                                  additionalInformationRender={() =>
                                                    renderAdditionalInformation(
                                                      name,
                                                    )
                                                  }
                                                  onChange={(v) =>
                                                    handleOnChangeLookUp(
                                                      v,
                                                      "driver",
                                                      name,
                                                      nameDriver,
                                                    )
                                                  }
                                                  onAsyncChange={(key, row) =>
                                                    getShipmentStatus(
                                                      key,
                                                      row,
                                                      "driver",
                                                      name,
                                                    )
                                                  }
                                                />
                                              </Form.Item>
                                            ),
                                          );
                                        }}
                                      </Form.List>
                                    </Col>
                                  )}
                                </Row>
                              </>
                            )}
                          </Card>
                        </Col>
                      </Row>
                    </Form.Item>
                  ))}
                  {!disabled && !IS_EDIT && (
                    <Space>
                      <Button
                        type="dashed"
                        disabled={shipmentDetails?.length >= 10}
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                      >
                        {t("button.addRow")}
                      </Button>
                    </Space>
                  )}
                </>
              );
            }}
          </Form.List>
        </Col>
      </Row>
    </Form>
  );
};

export default BookingOrderBulk;
