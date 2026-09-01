import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  approvalBookingOrderActions,
  bookingOrderActions,
  customerRouteActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { Form } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import ApprovalBookingOrderBulk from "./approval-booking-order-bulk";

const ApprovalBookingForm = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, {
    keyPrefix: "approvalBookingOrder.form",
  });

  const router = useRouter();

  const id = router.query?.id as string;

  const dispatch = useAppDispatch();
  const { dropdownAdditionalRequestItems } = useAppSelector(
    (state) => state.bookingOrder,
  );

  const { detailApprovalBooking } = useAppSelector(
    (state) => state.approvalBookingOrder,
  );

  const requiredMessage = t("message");
  const FORM_ORDER_CONFIG: ChildConfig[] = [
    {
      id: "customerName",
      type: "select",
      name: "customerName",
      label: t("input.customerName.label"),
      placeholder: t("input.customerName.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "branchOrder",
      type: "select",
      name: "branchOrder",
      label: t("input.branchOrder.label"),
      placeholder: t("input.branchOrder.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "shipmentType",
      type: "select",
      name: "shipmentType",
      label: t("input.shipmentType.label"),
      placeholder: t("input.shipmentType.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "pickUpDate",
      type: "date",
      name: "pickUpDate",
      label: t("input.pickUpDate.label"),
      placeholder: t("input.pickUpDate.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "salesDealing",
      type: "select",
      name: "salesDealing",
      label: t("input.salesDealing.label"),
      placeholder: t("input.salesDealing.placeholder"),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "salesServicing",
      type: "select",
      name: "salesServicing",
      label: t("input.salesServicing.label"),
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
      disabled: true,
      options: dropdownAdditionalRequestItems.data.map((_item) => ({
        value: _item?.id,
        label: _item?.name,
      })),
    },
  ];

  useEffect(() => {
    form.setFieldValue("shipmentDetails", [undefined]);
    dispatch(bookingOrderActions.getDropdownAdditionalRequestItemsFetch());
  }, []);

  useEffect(() => {
    dispatch(
      approvalBookingOrderActions.getApprovalBookingOrderDetailFetch({
        id: id,
      }),
    );
  }, []);

  useEffect(() => {
    if (id && detailApprovalBooking?.data?.id) {
      const {
        customerName,
        branchName,
        shipmentType,
        pickupDate,
        pickupTime,
        salesDealing,
        salesServicing,
        shipmentDetail,
        additionalRequests,
        notes,
        unitTypeId,
        qtyDriver,
        customerRouteId,
      } = detailApprovalBooking.data;
      dispatch(
        customerRouteActions.getDetailCustomerRouteFetch({
          id: customerRouteId,
        }),
      );
      form.setFieldsValue({
        customerName,
        branchOrder: branchName,
        shipmentType,
        pickUpDate: dayjs(pickupDate, "YYYY-MM-DD"),
        salesDealing,
        salesServicing,
        additionalRequest: additionalRequests?.map((v) => v?.id),
        shipmentDetails: [
          {
            ...shipmentDetail,
            customerRouteId,
            typeUnit: unitTypeId,
            pickupHour: dayjs(pickupTime, "HH:mm"),
            licensePlate: shipmentDetail?.vehicleId,
            notes: notes,
            qtyDriver: qtyDriver,
            routes: shipmentDetail?.routeLocations?.map((route) => ({
              ...route,
              customerRouteId: "",
              origin: route.locationName,
              destination: route.locationName,
              qtyDriver: 2,
            })),
          },
        ],
      });
    }
  }, [detailApprovalBooking?.data?.id, id]);
  return (
    <>
      <RsFormBuilder
        type={"create"}
        layout="vertical"
        name={""}
        form={form}
        onFinish={() => {}}
        onCancel={() => {}}
        configs={FORM_ORDER_CONFIG}
        isHideFormButton
        loading={true}
        disabled={true}
      />

      {/* BULK INPUT BOOKING ORDER */}
      {/* TO PRESERVE READABLE CODE, MADE A COPY OF SIMILIAR COMPONENT OF THE FORM */}
      {/* IF YOU WANT TO RESOLVE BUGS FOR DROP BASED FORM USE THE APPRORIATE COMPONENT */}
      <ApprovalBookingOrderBulk
        form={form}
        disabled={true}
        shipmentType={"Dedicated"}
        type={""}
      />
    </>
  );
};

export default ApprovalBookingForm;
