import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
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
  RouteLocations,
} from "@sera-types/booking-order.type";
import { Contract } from "@sera-types/customer-contract.type";
import {
  CustomerRoute,
  customerRouteTypes,
} from "@sera-types/customer-route.type";
import { DriverRecord, driversTypes } from "@sera-types/drivers.type";
import { stockManagementTypes } from "@sera-types/stock-management.type";
import { captureErrorAxios } from "@sera-utils/error-handler";
import { Col, Divider, Form, Row, Space, TimePicker } from "antd";
import { FormInstance } from "antd/lib";
import dayjs from "dayjs";
import { isEqualWith, isNil } from "lodash";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
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

const DropBookingOrderBulk: FC<BookingOrderBulkProps> = ({
  form,
  disabled,
  type,
  // shipmentType,
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "bookingOrder.form" });
  const requiredMessage = "";
  const IS_EDIT = type === "edit";
  const IS_DETAIL = type === "detail";
  const dispatch = useAppDispatch();

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
    // branchOrder,
    customerName,
  } = Form.useWatch([], form) || {};

  const IS_FIRST_ROUTE_SELECTED = (index: number) => {
    return !!shipmentDetails?.[index]?.routes?.[0]?.customerRouteId;
  };

  const { dropdownVehicleTypes } = useAppSelector(
    (state) => state.vehicleTypes,
  );
  const { dropdownCustomerRoutes } = useAppSelector(
    (state) => state.customerRoutes,
  );
  const { data: vehiclesStock, options: vehicleStockOptions } = useAppSelector(
    (state) => state.stockManagement,
  );
  const { data: driversList, options: driversOptions } = useAppSelector(
    (state) => state.drivers,
  );
  const loading = useAppSelector((state) => state.loading);

  const MAPPED_DRIVERS_LIST = driversList
    // .filter((v) => v.shipmentType.toLowerCase() === shipmentType?.toLowerCase())
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

  const MAPPED_VEHICLE_TYPES =
    dropdownVehicleTypes.data.map((v) => ({
      label: v.name,
      value: v.id,
    })) || [];

  const MAPPED_CUSTOMER_ROUTE = (dropdownCustomerRoutes.data || []).map(
    (v) => ({
      ...v,
      label: v.originalRouteCode,
      value: v.id,
    }),
  );

  const FILTER_CUSTOMER_ROUTE = (index: number, indexRoute: number) => {
    const isArr = Array.isArray(shipmentDetails?.[index]?.routes);
    if (!isArr) return [];

    const routes = (shipmentDetails[index]?.routes || []) as any[];

    const FIRST_ORIGIN = routes[0]?.origin;

    const currentRoute = routes[indexRoute]?.customerRouteId;

    const selectedRoutes = routes
      .filter(Boolean)
      .filter((v) => v.customerRouteId !== currentRoute)
      .map((v) => v.customerRouteId);

    if (FIRST_ORIGIN && indexRoute > 0) {
      return MAPPED_CUSTOMER_ROUTE.filter(
        (o) => !selectedRoutes.includes(o.id) && o.origin === FIRST_ORIGIN,
      );
    }

    return MAPPED_CUSTOMER_ROUTE.filter((o) => !selectedRoutes.includes(o.id));
  };

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
        value?.key,
      );
      form.validateFields([["shipmentDetails", index, "drivers", indexDriver]]);
    }

    if (type === "licensePlate") {
      const value = v as OnChangeLookUpProps<LicensePlateRecord>;
      form.setFieldValue(
        ["shipmentDetails", index, "licensePlate"],
        value?.key,
      );
      form.validateFields([["shipmentDetails", index, "licensePlate"]]);
    }
  };

  const handlePickupHour = (eta: dayjs.Dayjs, time: dayjs.Dayjs) => {
    const hours = time.hour();
    const minutes = time.minute();

    const updatedEta = eta.add(hours, "hour").add(minutes, "minute");

    return updatedEta;
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

  const handleClearRoute = (index: number, indexRoute: number) => {
    if (!indexRoute) {
      form.resetFields([["shipmentDetails", index]]);
      form.resetFields([["shipmentDetails", index, "routes"]]);
      form.setFieldValue(["shipmentDetails", index, "routes"], [undefined]);
    } else {
      const base = ["shipmentDetails", index, "routes", indexRoute];
      form.resetFields([[...base, "customerRouteId"]]);
      form.resetFields([[...base, "qtyDriver"]]);
      form.resetFields([[...base, "origin"]]);
      form.resetFields([[...base, "destination"]]);
    }
  };

  const getHighestQtyDriver = (index: number) => {
    if (!shipmentDetails?.length) return 1;

    const routes = shipmentDetails[index]?.routes || [];

    const qtyDrivers: number[] = routes.map((v: any) => v?.qtyDriver || 0);
    const maxQty = Math.max(...qtyDrivers);

    form.setFieldValue(["shipmentDetails", index, "qtyDriver"], maxQty || 1);
    const drivers = form.getFieldValue(["shipmentDetails", index, "drivers"]);

    // validate maximum drivers
    if (!Number.isNaN(maxQty) && drivers?.length > maxQty) {
      const splicedDrivers = drivers.splice(1, 1);
      form.setFieldValue(
        ["shipmentDetails", index, "qtyDriver"],
        splicedDrivers,
      );
    }

    return maxQty || 1;
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

  const getRouteDetail = async (
    index: number,
    indexRoute: number,
    id: string,
  ) => {
    if (!id) return;
    const { origin, destination, qtyDriver, contractId, vehicleTypeName } =
      MAPPED_CUSTOMER_ROUTE.find((o) => o.customerRouteId === id) || {};
    if (indexRoute < 1) {
      try {
        const { data } = await CustomerContractApi().getDetailContract({
          id: contractId!,
        });

        const _data = data.data as Contract;
        const materials =
          _data.materials?.find((o) => o.vehicleTypeName === vehicleTypeName) ||
          {};
        if (!materials?.vehicleTypeId || materials?.vehicleTypeId === "-") {
          MessageHandler().error("Vehicle type is not available");
          return;
        }
        form.setFieldValue(
          ["shipmentDetails", index, "typeUnit"],
          materials?.vehicleTypeId,
        );

        form.resetFields([["shipmentDetails", index, "routes"]]);

        form.setFieldValue(["shipmentDetails", index, "routes", indexRoute], {
          customerRouteId: id,
          origin: origin || "-",
          destination: destination || "-",
          qtyDriver: qtyDriver || 0,
        });
      } catch (_error: unknown) {
        captureErrorAxios(_error);
        handleClearRoute(index, indexRoute);
      }
    } else {
      form.setFieldValue(["shipmentDetails", index, "routes", indexRoute], {
        customerRouteId: id,
        origin: origin || "-",
        destination: destination || "-",
        qtyDriver: qtyDriver || 0,
      });
    }
  };

  const getRouteJourney = (index: number): RouteJourneyRecord[] => {
    let routes: RouteLocations[] = [];
    if (IS_DETAIL) {
      routes = detailBooking.data.shipmentDetail?.routeLocations || [];
    } else {
      routes = (form.getFieldValue(["shipmentDetails", index, "routes"]) ||
        []) as RouteLocations[];
    }
    return routes.filter(Boolean).flatMap((v, i) => {
      const route = MAPPED_CUSTOMER_ROUTE.find(
        (o: CustomerRoute) => o.customerRouteId === v.customerRouteId,
      ) as CustomerRoute;
      if (i === 0) {
        return [
          {
            no: 1,
            type: "Origin",
            location: route?.origin || "-",
            address: route?.detailOrigin || "-",
          },
          {
            no: 2,
            type: `Drop Center ${i + 1}`,
            location: route?.destination || "-",
            address: route?.detailDestination || "-",
          },
        ];
      } else {
        return {
          no: i + 2,
          type: `Drop Center ${i + 1}`,
          location: route?.destination || "-",
          address: route?.detailDestination || "-",
        };
      }
    });
  };

  const getDriversList = (options: BaseType) => {
    const params = {
      ...options,
      // branchId: branchOrder ? branchOrder : undefined,
      customerId: customerName ? customerName : undefined,
    };

    dispatch(driversActions.getDriversFetch(params));
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
          simType: data.simType,
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

  const handleDisabledTime = (selectedDate: dayjs.Dayjs) => {
    const _pickupDate = pickUpDate as dayjs.Dayjs;
    const isToday = _pickupDate?.isSame(dayjs(), "day") || false;
    const currentHour = dayjs().add(2, "hours").hour();

    const disabledHours = () => {
      const hours: number[] = [];

      // disable past hour if pickup date is today
      if (isToday) {
        for (let i = 0; i < currentHour; i++) {
          hours.push(i);
        }
      }

      return hours;
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

  // CALCULATE ESTIMATED TIME ARRIVED
  useEffect(() => {
    if (!pickUpDate) return;
    if (!shipmentDetails?.length) return;
    if (!dropdownCustomerRoutes.data?.length) return;

    const shipments = shipmentDetails as any[];

    const updated = shipments.map((item, idx) => {
      let eta = pickUpDate as dayjs.Dayjs;
      const routes = (shipments?.[idx]?.routes || []) as any[];
      const pickupHour = shipments?.[idx]?.pickupHour as null | dayjs.Dayjs;

      if (pickupHour) {
        eta = handlePickupHour(eta, pickupHour);
      }
      routes.forEach((route) => {
        const r = dropdownCustomerRoutes?.data?.find(
          (o) => o.customerRouteId === route?.customerRouteId,
        );

        if (r && r.leadtimeValue != null && r.leadtimeType != null) {
          eta = eta.add(
            r.leadtimeValue,
            r.leadtimeType as unknown as dayjs.ManipulateType,
          );
        }
      });

      return {
        ...item,
        eta: eta.format("DD-MM-YYYY HH:mm"),
      };
    });

    if (!isEqualWith(updated, shipmentDetails)) {
      form.setFieldsValue({ shipmentDetails: updated });
    }
  }, [pickUpDate, shipmentDetails, dropdownCustomerRoutes?.data]);

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
                              <Col span={24}>
                                <Form.List name={[name, "routes"]}>
                                  {(
                                    routes,
                                    { add: addRoute, remove: removeRoute },
                                  ) => {
                                    return (
                                      <>
                                        {routes.map(
                                          ({
                                            key: keyRoute,
                                            name: nameRoute,
                                            ...restRoute
                                          }) => (
                                            <>
                                              <Card
                                                key={key + "routes"}
                                                noShadow
                                                style={{
                                                  border: "1px solid #3A8DDB61",
                                                  marginTop: "1.5rem",
                                                }}
                                              >
                                                {!disabled &&
                                                  !(nameRoute < 1) && (
                                                    <button
                                                      type="button"
                                                      className={
                                                        styles[
                                                          "button-delete-route"
                                                        ]
                                                      }
                                                      onClick={() => {
                                                        removeRoute(nameRoute);
                                                      }}
                                                    >
                                                      <CloseOutlined
                                                        style={{ fontSize: 12 }}
                                                      />
                                                    </button>
                                                  )}
                                                <Row
                                                  key={keyRoute}
                                                  gutter={[16, 16]}
                                                >
                                                  <Col lg={8} md={12} span={24}>
                                                    <Form.Item
                                                      {...restRoute}
                                                      label={t(
                                                        "input.shipmentDetails.customerRouteId.label",
                                                      )}
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            requiredMessage,
                                                        },
                                                      ]}
                                                      name={[
                                                        nameRoute,
                                                        "customerRouteId",
                                                      ]}
                                                    >
                                                      <Select
                                                        disabled={
                                                          loading[
                                                            customerRouteTypes
                                                              .GET_DROPDOWN_CUSTOMER_ROUTES
                                                          ] || disabled
                                                        }
                                                        onClear={() => {
                                                          handleClearRoute(
                                                            name,
                                                            nameRoute,
                                                          );
                                                        }}
                                                        onChange={(value) =>
                                                          getRouteDetail(
                                                            name,
                                                            nameRoute,
                                                            value,
                                                          )
                                                        }
                                                        options={FILTER_CUSTOMER_ROUTE(
                                                          name,
                                                          nameRoute,
                                                        )}
                                                        optionFilterProp="label"
                                                        placeholder={t(
                                                          "input.shipmentDetails.customerRouteId.placeholder",
                                                        )}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col lg={4} md={12} span={24}>
                                                    <Form.Item
                                                      {...restRoute}
                                                      label={t(
                                                        "input.shipmentDetails.qtyDriver.label",
                                                      )}
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message:
                                                            requiredMessage,
                                                        },
                                                      ]}
                                                      name={[
                                                        nameRoute,
                                                        "qtyDriver",
                                                      ]}
                                                    >
                                                      <Input
                                                        disabled
                                                        placeholder={t(
                                                          "input.shipmentDetails.qtyDriver.placeholder",
                                                        )}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col lg={6} md={12} span={24}>
                                                    <Form.Item
                                                      {...restRoute}
                                                      label={t(
                                                        "input.shipmentDetails.origin.label",
                                                      )}
                                                      rules={[
                                                        {
                                                          required: false,
                                                          message:
                                                            requiredMessage,
                                                        },
                                                      ]}
                                                      name={[
                                                        nameRoute,
                                                        "origin",
                                                      ]}
                                                    >
                                                      <Input
                                                        disabled
                                                        placeholder={t(
                                                          "input.shipmentDetails.origin.placeholder",
                                                        )}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col lg={6} md={12} span={24}>
                                                    <Form.Item
                                                      {...restRoute}
                                                      label={t(
                                                        "input.shipmentDetails.destination.label",
                                                      )}
                                                      rules={[
                                                        {
                                                          required: false,
                                                          message:
                                                            requiredMessage,
                                                        },
                                                      ]}
                                                      name={[
                                                        nameRoute,
                                                        "destination",
                                                      ]}
                                                    >
                                                      <Input
                                                        disabled
                                                        placeholder={t(
                                                          "input.shipmentDetails.destination.placeholder",
                                                        )}
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                </Row>
                                              </Card>
                                            </>
                                          ),
                                        )}
                                        {!disabled && (
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "end",
                                              marginTop: "1rem",
                                            }}
                                          >
                                            <Button
                                              type="link"
                                              disabled={
                                                (!IS_FIRST_ROUTE_SELECTED(
                                                  name,
                                                ) &&
                                                  routes.length >= 1) ||
                                                !shipmentDetails[name]?.typeUnit
                                              }
                                              onClick={() => addRoute()}
                                              icon={<PlusOutlined />}
                                            >
                                              {t("button.addRoute")}
                                            </Button>
                                          </div>
                                        )}
                                      </>
                                    );
                                  }}
                                </Form.List>
                              </Col>
                            </Row>
                            {IS_FIRST_ROUTE_SELECTED(name) &&
                              shipmentDetails?.[name]?.typeUnit && (
                                <>
                                  <Divider />
                                  {/* TYPE UNIT FIELD */}
                                  <Row gutter={[16, 16]}>
                                    {/* TYPE UNIT */}
                                    <Col lg={4} md={12} span={24}>
                                      <Form.Item
                                        {...rest}
                                        label={t(
                                          "input.shipmentDetails.typeUnit.label",
                                        )}
                                        rules={[
                                          {
                                            required: true,
                                            message: requiredMessage,
                                          },
                                        ]}
                                        name={[name, "typeUnit"]}
                                      >
                                        <Select
                                          disabled
                                          options={MAPPED_VEHICLE_TYPES}
                                          placeholder={t(
                                            "input.shipmentDetails.typeUnit.placeholder",
                                          )}
                                        />
                                      </Form.Item>
                                    </Col>
                                    {/* LICENSE PLATE */}
                                    <Col lg={4} md={12} span={24}>
                                      <Form.Item
                                        {...rest}
                                        label={
                                          <p
                                            title={t(
                                              "input.shipmentDetails.licensePlate.label",
                                            )}
                                            className={
                                              styles["custom-label-form-item"]
                                            }
                                          >
                                            {t(
                                              "input.shipmentDetails.licensePlate.label",
                                            )}
                                          </p>
                                        }
                                        rules={[
                                          {
                                            required: true,
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
                                          disabled={
                                            loading[
                                              stockManagementTypes.GET_STOCK
                                            ]
                                          }
                                          additionalInformationRender={() =>
                                            renderAdditionalInformation(name)
                                          }
                                          dataOptions={vehicleStockOptions}
                                          columns={licensePlateColumns}
                                          data={MAPPED_LICENSE_PLATE}
                                          rowKey="id"
                                          asValue="licensePlate"
                                          onAsyncChange={(key, row) =>
                                            getShipmentStatus(
                                              key,
                                              row,
                                              "licensePlate",
                                              name,
                                            )
                                          }
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
                                    {/* QTY DRIVER */}
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
                                                  styles[
                                                    "custom-label-form-item"
                                                  ]
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
                                                        t(
                                                          "input.maximumQtyDriver",
                                                        ),
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
                                              disabled
                                              type="number"
                                              name={"qtyDriver"}
                                              min={1}
                                              placeholder={t(
                                                "input.shipmentDetails.qtyDriver.placeholder",
                                              )}
                                            />
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                    </Col>
                                    {/* DRIVERS */}
                                    <Col lg={4} md={12} span={24}>
                                      {Array.from({
                                        length: getHighestQtyDriver(name)!,
                                      }).map((_, idx) => (
                                        <Form.Item
                                          key={idx}
                                          {...rest}
                                          label={t(
                                            "input.shipmentDetails.driver.label",
                                            {
                                              value: idx + 1,
                                            },
                                          )}
                                          rules={[
                                            {
                                              required: true,
                                              message: requiredMessage,
                                            },
                                          ]}
                                          name={[name, "drivers", idx]}
                                        >
                                          <InputLookUp
                                            key={`input_lookup_${idx}_driver`}
                                            title={t("title.driver", {
                                              value: idx + 1,
                                            })}
                                            loading={
                                              loading[driversTypes.GET_DRIVERS]
                                            }
                                            placeholder={t(
                                              "input.shipmentDetails.driver.placeholder",
                                            )}
                                            fieldValue={form.getFieldValue([
                                              "shipmentDetails",
                                              name,
                                              "drivers",
                                              idx,
                                            ])}
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
                                                  idx,
                                                ])
                                              ]
                                            }
                                            disabled={
                                              loading[
                                                driversTypes.GET_DRIVERS
                                              ] || disableDriver
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
                                              idx,
                                            )}
                                            additionalInformationRender={() =>
                                              renderAdditionalInformation(name)
                                            }
                                            onAsyncChange={(key, row) =>
                                              getShipmentStatus(
                                                key,
                                                row,
                                                "driver",
                                                name,
                                              )
                                            }
                                            onChange={(v) =>
                                              handleOnChangeLookUp(
                                                v,
                                                "driver",
                                                name,
                                                idx,
                                              )
                                            }
                                          />
                                        </Form.Item>
                                      ))}
                                    </Col>
                                    {/* PICKUP HOUR */}
                                    <Col lg={3} md={12} span={24}>
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
                                          disabledTime={handleDisabledTime}
                                          format="HH:mm"
                                          style={{
                                            borderRadius: 20,
                                            width: "100%",
                                          }}
                                        />
                                      </Form.Item>
                                    </Col>
                                    {/* ETA */}
                                    <Col lg={3} md={12} span={24}>
                                      <Form.Item
                                        {...rest}
                                        label={t(
                                          "input.shipmentDetails.eta.label",
                                        )}
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
                                          name={t(
                                            "input.shipmentDetails.eta.label",
                                          )}
                                          placeholder={t(
                                            "input.shipmentDetails.eta.placeholder",
                                          )}
                                        />
                                      </Form.Item>
                                    </Col>
                                    {/* NOTES */}
                                    <Col lg={3} md={12} span={24}>
                                      <Form.Item
                                        {...rest}
                                        label={t(
                                          "input.shipmentDetails.notes.label",
                                        )}
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

                                  <Divider
                                    orientation="left"
                                    orientationMargin={0}
                                  >
                                    {t("title.summaryRouteLocation")}
                                  </Divider>
                                  {/* ADDITIONAL INFORMATION */}
                                  <Row gutter={[24, 24]} justify="start">
                                    <Col span={24}>
                                      <Table
                                        showTitle={false}
                                        columns={routeColumns}
                                        scroll={{ x: "max-content" }}
                                        dataSource={getRouteJourney(name)}
                                        isCustomSearch={false}
                                        showActions={false}
                                      />
                                    </Col>
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
                        onClick={() => {
                          add({ routes: [undefined] });
                        }}
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

export default DropBookingOrderBulk;
