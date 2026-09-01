import Button from "@sera-components/button";
import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  bookingOrderActions,
  businessAreaActions,
  customerActions,
  customerRouteActions,
  getBookingOrderDetailClear,
  getBookingOrderDetailFetch,
  useAppDispatch,
  useAppSelector,
  vehicleTypeActions,
} from "@sera-redux";
import { bookingOrderTypes } from "@sera-types/booking-order.type";
import { customerTypes } from "@sera-types/customer.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Form, Row, Space } from "antd";
import { FormInstance } from "antd/lib";
import dayjs from "dayjs";
import { uniqBy } from "lodash";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import BookingFormModal from "./booking-form-modal";
import BookingOrderBulk from "./booking-order-bulk";
import DropBookingOrderBulk from "./booking-order-bulk-drop";

export interface ModalFormProps {
  type: "driver" | "licensePlate" | null;
  open: boolean;
  index?: number;
  value?: string;
  onChange?: (v: React.Key) => void;
  disabled?: string[];
}

interface DETAIL_ORDER_FORM {
  typeUnit: string;
  licensePlate?: string;
  route: string;
  pickupHours: string;
  qtyUnit?: number;
  qtyDriver: number;
  notes?: string;
}
interface BOOKING_ORDER_FORM {
  shipmentType?: string;
  branchOrder?: string;
  pickupDate?: string;
  salesName?: string;
  customerName?: string;
  shipmentDetails?: DETAIL_ORDER_FORM[];
}

interface BookingOrderFormProps {
  form: FormInstance;
  type: "edit" | "create" | "detail";
  onSubmit?: ({
    isDraft,
    isDropBase,
  }: {
    isDraft: boolean;
    isDropBase: boolean;
  }) => void;
}

export const MATERIAL_CODE = {
  Ritase: "LT-FRR",
  Dedicated: "LT-FDD",
  DropBase: "LT-FDDDO",
};

const SHIPMENT_TYPE_OPTIONS = [
  {
    label: "Ritase",
    value: "Ritase",
  },
  {
    label: "Dedicated",
    value: "Dedicated",
  },
];

export const DROP_BASED_OPTIONS = [
  {
    label: "Drop-Based Dedicated",
    value: "Drop-Based Dedicated",
  },
];

const PAYLOAD = { page: 1, limit: 10 };

const BookingOrderForm: FC<BookingOrderFormProps> = ({
  form,
  type,
  onSubmit,
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "bookingOrder.form" });
  const [modalForm, setModalForm] = useState<ModalFormProps>({
    type: null,
    open: false,
  });

  const dispatch = useAppDispatch();
  const { detailBooking, dropdownAdditionalRequestItems } = useAppSelector(
    (state) => state.bookingOrder,
  );
  const loading = useAppSelector((state) => state.loading);
  const businessAreas = useAppSelector((state) => state.businessAreas);
  const {
    detailCustomer,
    customerSales,
    data: { list: customersData },
  } = useAppSelector((state) => state.customers);
  const router = useRouter();

  const watch = Form.useWatch([], form);

  const id = router.query.id as string;
  const IS_DROP_BASED_TYPE = router?.query?.shipmentType === "drop";
  const isEdit = type === "edit";
  const isDetail = type === "detail";
  // const isCreate = type === "create";
  const { shipmentType, customerName, branchOrder } = (Form.useWatch(
    [],
    form,
  ) || {}) as BOOKING_ORDER_FORM;

  const DISABLE_FORM =
    loading[bookingOrderTypes.UPDATE_BOOKING_ORDER] ||
    loading[bookingOrderTypes.CREATE_BOOKING_ORDER];

  const requiredMessage = t("input.message");

  const handleClearRoute = () => {
    const shipmnetDetail = form.getFieldValue(["shipmentDetails"]);

    if (shipmnetDetail?.length) {
      form.resetFields([["shipmentDetails"]]);
      form.setFieldValue(["shipmentDetails", 0, "routes"], [undefined]);
    }
  };

  const handleClearDriver = () => {
    form.resetFields(["salesDealing", "salesServicing"]);
    const isArr = Array.isArray(watch?.shipmentDetails);

    if (!isArr) return;

    const shipmentDetails = watch?.shipmentDetails as any[];

    shipmentDetails.forEach((v, idx) => {
      if (IS_DROP_BASED_TYPE) {
        form.resetFields([["shipmentDetails", idx, "drivers"]]);
        const obj = form.getFieldValue(["shipmentDetails", idx]);
        delete obj.drivers;
        form.setFieldValue(["shipmentDetails", idx], obj);
      } else {
        const drivers = form.getFieldValue([
          "shipmentDetails",
          idx,
          "drivers",
        ]) as any[];

        if (drivers) {
          form.setFieldValue(
            ["shipmentDetails", idx, "drivers"],
            drivers.map(() => undefined),
          );
        }
      }
    });
  };

  const handleChangeShipmentType = () => {
    if (isEdit) {
      form.resetFields(["shipmentDetails"]);
      form.setFieldValue(["shipmentDetails"], [undefined]);
      return;
    }

    form.resetFields(["shipmentDetails"]);
  };

  const handleOnChangePickupDate = (value: dayjs.Dayjs | null) => {
    const isArr = Array.isArray(watch?.shipmentDetails);
    if (!isArr) return;
    const shipmentDetails = watch?.shipmentDetails as any[];

    if (!value) {
      shipmentDetails.forEach((_, idx) => {
        form.resetFields([["shipmentDetails", idx, "eta"]]);
      });
    }
    shipmentDetails.forEach((_, idx) => {
      form.resetFields([["shipmentDetails", idx, "pickupHour"]]);
    });
  };

  const filterSameVal = (arr: { label: string; value: string }[]) => {
    if (!arr.length) return [];
    return arr.filter(
      (sales, index, arr) =>
        arr.findIndex((o) => o.value === sales.value) === index,
    );
  };

  const salesDropdown = useCallback(
    (type: "servicing" | "dealing") => {
      if (!customerName || !branchOrder || !customerSales.data?.length) {
        return [];
      }

      let _dropdown = [];
      if (type === "dealing") {
        _dropdown = customerSales.data
          .filter((o) => o.branch?.id === branchOrder)
          .map((v) => ({
            label: v.salesDealing?.name || "-",
            value: v.salesDealing?.name || "-",
          }));
      } else {
        _dropdown = customerSales.data
          .filter((o) => o.branch?.id === branchOrder)
          .map((v) => ({
            label: v.salesServicing?.name || "-",
            value: v.salesServicing?.name || "-",
          }));
      }

      return filterSameVal(_dropdown);
    },
    [customerName, branchOrder, customerSales],
  );

  const FORM_ORDER_CONFIG: ChildConfig[] = [
    {
      id: "customerName",
      type: "select",
      name: "customerName",
      label: t("input.customerName.label"),
      placeholder: t("input.customerName.placeholder"),
      options: customersData ?? [],
      valueField: "id",
      labelField: "name",
      rules: [{ required: true, message: requiredMessage }],
      onChange: handleClearRoute,
      onSearch(_value) {
        dispatch(
          customerActions.getCustomersFetch({
            ...PAYLOAD,
            searchBy: "name",
            search: _value,
          }),
        );
      },
      onClear() {
        dispatch(customerActions.getCustomersFetch({ ...PAYLOAD }));
      },
      loading: loading[customerTypes.GET_CUSTOMERS],
      disabled: isEdit,
    },
    {
      id: "branchOrder",
      type: "select",
      name: "branchOrder",
      label: t("input.branchOrder.label"),
      onChange: handleClearDriver,
      placeholder: t("input.branchOrder.placeholder"),
      options: businessAreas.dropdownBusinessAreas.data.map((v) => ({
        label: v.name,
        value: v.id,
      })),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "shipmentType",
      type: "select",
      name: "shipmentType",
      options: SHIPMENT_TYPE_OPTIONS,
      disabled: IS_DROP_BASED_TYPE,
      onChange: handleChangeShipmentType,
      label: t("input.shipmentType.label"),
      placeholder: t("input.shipmentType.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "pickUpDate",
      type: "date",
      name: "pickUpDate",
      onChange: (v) => handleOnChangePickupDate(v),
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().add(5, "year").format("YYYY-MM-DD"),
      label: t("input.pickUpDate.label"),
      placeholder: t("input.pickUpDate.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "salesDealing",
      type: "select",
      name: "salesDealing",
      label: t("input.salesDealing.label"),
      options: salesDropdown("dealing"),
      placeholder: t("input.salesDealing.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "salesServicing",
      type: "select",
      name: "salesServicing",
      label: t("input.salesServicing.label"),
      options: salesDropdown("servicing"),
      placeholder: t("input.salesServicing.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "additionalRequest",
      type: "checkbox",
      name: "additionalRequest",
      label: t("input.additionalRequest.label"),
      placeholder: t("input.additionalRequest.placeholder"),
      columns: { xs: 12, xl: 8 },
      options: dropdownAdditionalRequestItems.data.map((_item) => ({
        value: _item?.id,
        label: _item?.name,
        // disabled: detailCustomer?.data?.additionalRequests?.includes(_item.id),
      })),
      loading: loading[bookingOrderTypes.GET_DROPDOWN_ADDITIONAL_REQUEST_ITEMS],
      dependency: {
        fields: [],
        visibility: () => !!customerName && !!detailCustomer.data?.id,
      },
    },
  ];

  useEffect(() => {
    if (IS_DROP_BASED_TYPE) {
      form.setFieldValue("shipmentType", SHIPMENT_TYPE_OPTIONS[1].value);
    }
  }, [IS_DROP_BASED_TYPE]);

  const getCustomerRoute = useCallback(() => {
    const params = {
      limit: 100,
      page: 1,
      customerId: customerName,
      materialCode: IS_DROP_BASED_TYPE
        ? MATERIAL_CODE["DropBase"]
        : MATERIAL_CODE[shipmentType as keyof typeof MATERIAL_CODE],
    };

    dispatch(customerRouteActions.getDropdownCustomerRoutesFetch(params));
  }, [customerName, shipmentType]);

  useEffect(() => {
    if (!customerName) return;
    if (!shipmentType) return;
    if (IS_DROP_BASED_TYPE) {
      getCustomerRoute();
      return;
    }
    if (!isDetail) {
      getCustomerRoute();
    } else if (isDetail) {
      dispatch(
        customerRouteActions.getDetailCustomerRouteFetch({
          id: detailBooking.data.shipmentDetail?.customerRouteId,
        }),
      );
    }

    return () => {
      dispatch(customerRouteActions.getDropdownCustomerRoutesClear());
      dispatch(customerRouteActions.getDetailCustomerRouteClear());
    };
  }, [isDetail, customerName, IS_DROP_BASED_TYPE, shipmentType]);

  useEffect(() => {
    dispatch(bookingOrderActions.getDropdownAdditionalRequestItemsFetch());
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));
    dispatch(vehicleTypeActions.getDropdownVehicleTypesFetch({}));
    dispatch(customerActions.getDropdownSalesFetch());
    dispatch(customerActions.getCustomersFetch({ ...PAYLOAD }));

    return () => {
      dispatch(customerActions.getCustomersClear());
      dispatch(bookingOrderActions.getDropdownAdditionalRequestItemsClear());
      dispatch(businessAreaActions.getDropdownBusinessAreasClear());
      dispatch(vehicleTypeActions.getDropdownVehicleTypesClear());
      dispatch(customerActions.getDropdownSalesClear());
      dispatch(customerActions.getCustomersClear());
    };
  }, []);

  useEffect(() => {
    if (customerName) {
      // getCustomerRoute();
      dispatch(customerActions.getDetailCustomerFetch({ id: customerName }));
      dispatch(
        customerActions.getCustomerSalesFetch({ customerId: customerName }),
      );
    }

    return () => {
      dispatch(customerRouteActions.getDropdownCustomerRoutesClear());
      dispatch(customerActions.getDetailCustomerClear());
      dispatch(customerActions.getCustomerSalesClear());
    };
  }, [customerName]);

  useEffect(() => {
    if (id)
      dispatch(
        getBookingOrderDetailFetch({
          id,
          serviceType: IS_DROP_BASED_TYPE ? "Drop Base" : undefined,
        }),
      );
    return () => {
      dispatch(getBookingOrderDetailClear());
    };
  }, [id]);

  useEffect(() => {
    if (id && detailBooking?.data?.id) {
      const {
        customerId,
        branchId,
        shipmentType,
        pickUpDate,
        salesDealing,
        salesServicing,
        shipmentDetail,
        additionalRequests,
      } = detailBooking.data;
      const IS_RITASE = shipmentType?.toLowerCase() === "ritase";
      const routeLocations =
        shipmentDetail?.routeLocations?.map((route) => ({
          ...route,
          customerRouteId: route.customerRouteId,
          origin: route.origin,
          destination: route.destination,
          qtyDriver: route.qtyDriver,
        })) || [];

      form.setFieldsValue({
        customerName: customerId,
        branchOrder: branchId,
        shipmentType,
        pickUpDate: dayjs(pickUpDate),
        salesDealing,
        salesServicing,
        additionalRequest: additionalRequests?.map((v) => v?.id),
        shipmentDetails: [
          ...(IS_DROP_BASED_TYPE
            ? [
                {
                  ...shipmentDetail,
                  typeUnit: shipmentDetail?.unitTypeId,
                  pickupHour: dayjs(shipmentDetail?.pickupHour, "HH:mm"),
                  licensePlate: shipmentDetail?.vehicleId,
                  routes: !isDetail
                    ? routeLocations
                    : uniqBy(routeLocations, "customerRouteId"),
                },
              ]
            : [
                {
                  ...shipmentDetail,
                  typeUnit: shipmentDetail?.unitTypeId,
                  pickupHour: dayjs(shipmentDetail?.pickupHour, "HH:mm"),
                  ...(!IS_RITASE
                    ? { licensePlate: shipmentDetail?.vehicleId }
                    : {}),
                },
              ]),
        ],
      });
    }
  }, [detailBooking?.data?.id, id]);

  useEffect(() => {
    if (
      customerName &&
      customerSales?.data?.length &&
      detailCustomer?.data?.id &&
      !isEdit &&
      !isDetail
    ) {
      form.resetFields(["additionalRequest"]);
      const additionalRequestVal = detailCustomer.data.additionalRequests;
      form.setFieldValue("additionalRequest", additionalRequestVal);
    }
  }, [customerSales, detailCustomer, isEdit, isDetail]);

  return (
    <>
      <Card title={t(`title.${type}`)}>
        {/* SINGLE INPUT BOOKING ORDER */}
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={FORM_ORDER_CONFIG}
          submitText={t("button.save")}
          cancelText={t("button.cancel")}
          isHideFormButton
          loading={isDetail || DISABLE_FORM}
          disabled={isDetail || DISABLE_FORM}
        />

        {/* BULK INPUT BOOKING ORDER */}
        {/* TO PRESERVE READABLE CODE, MADE A COPY OF SIMILIAR COMPONENT OF THE FORM */}
        {/* IF YOU WANT TO RESOLVE BUGS FOR DROP BASED FORM USE THE APPRORIATE COMPONENT */}
        {IS_DROP_BASED_TYPE ? (
          <DropBookingOrderBulk
            form={form}
            disabled={isDetail || !shipmentType || DISABLE_FORM}
            shipmentType={shipmentType}
            setModalForm={setModalForm}
            type={type}
          />
        ) : (
          <BookingOrderBulk
            form={form}
            disabled={isDetail || !shipmentType || DISABLE_FORM}
            shipmentType={shipmentType}
            setModalForm={setModalForm}
            type={type}
          />
        )}

        {/* CUSTOM FORM BUTTON */}
        {!isDetail && (
          <Row justify={"end"}>
            <Space style={{ marginTop: "1rem" }} align="end" wrap>
              <Button
                type="dashed"
                disabled={DISABLE_FORM}
                onClick={() =>
                  onSubmit?.({
                    isDraft: true,
                    isDropBase: IS_DROP_BASED_TYPE,
                  })
                }
              >
                {t("button.save")}
              </Button>
              <Button
                disabled={DISABLE_FORM}
                onClick={() =>
                  router.push(ROUTE.SALES_MANAGEMENT.BOOKING_ORDER)
                }
              >
                {t("button.cancel")}
              </Button>
              <Button
                disabled={DISABLE_FORM}
                type="primary"
                onClick={() =>
                  onSubmit?.({
                    isDraft: false,
                    isDropBase: IS_DROP_BASED_TYPE,
                  })
                }
              >
                {t("button.submit")}
              </Button>
            </Space>
          </Row>
        )}
      </Card>

      <BookingFormModal
        type={modalForm.type}
        open={modalForm.open}
        index={modalForm.index}
        value={modalForm.value}
        disabledValue={modalForm.disabled}
        onChange={modalForm.onChange}
        setModalForm={setModalForm}
      />
    </>
  );
};

export default BookingOrderForm;
