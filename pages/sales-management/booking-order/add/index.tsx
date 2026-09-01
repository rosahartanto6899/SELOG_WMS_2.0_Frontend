import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import MessageHandler from "@sera-libraries/message-handler";
import {
  bookingOrderActions,
  createBookingOrderFetch,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { CreateBookingOrderPayload } from "@sera-types/booking-order.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Form } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface onSubmitProps {
  isDropBase: boolean;
  isDraft: boolean;
}

const BookingOrderAddPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "bookingOrder" });
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { createBooking } = useAppSelector((state) => state.bookingOrder);
  const router = useRouter();

  const { shipmentType } = router.query || {};

  const IS_DROP_BASE = shipmentType === "drop";

  const handleSubmitForm = async ({ isDraft, isDropBase }: onSubmitProps) => {
    let payload: CreateBookingOrderPayload = {};
    try {
      const res = await form.validateFields();
      if (isDropBase) {
        payload = {
          isDropBase: isDropBase,
          customerId: res?.customerName,
          branchId: res?.branchOrder,
          salesDealing: res?.salesDealing,
          salesServicing: res?.salesServicing,
          pickUpDate: dayjs(res?.pickUpDate).format("YYYY-MM-DD"),
          additionalRequests: res?.additionalRequest || [],
          shipmentDetails:
            res?.shipmentDetails?.map((v: any) => ({
              notes: v?.notes,
              vehicleId: v?.licensePlate,
              pickupHour: dayjs(v?.pickupHour).format("HH:mm"),
              routes: v?.routes?.map((route: any) => route?.customerRouteId),
              drivers: v?.drivers,
            })) || undefined,
          isDraft,
        };
      } else {
        const isRitase = res?.shipmentType?.toLowerCase() === "ritase";
        payload = {
          customerId: res?.customerName,
          branchId: res?.branchOrder,
          shipmentType: res?.shipmentType,
          salesDealing: res?.salesDealing,
          salesServicing: res?.salesServicing,
          pickUpDate: dayjs(res?.pickUpDate).format("YYYY-MM-DD"),
          additionalRequests: res?.additionalRequest || [],
          shipmentDetails:
            res?.shipmentDetails?.map((v: any) => ({
              customerRouteId: v?.customerRouteId,
              notes: v?.notes,
              pickupHour: dayjs(v?.pickupHour).format("HH:mm"),
              ...(isRitase ? { qtyUnit: Number(v?.qtyUnit) } : {}),
              ...(!isRitase ? { qtyDriver: Number(v?.qtyDriver) } : {}),
              ...(!isRitase ? { drivers: v?.drivers } : {}),
              ...(!isRitase ? { vehicleId: v?.licensePlate } : {}),
            })) || [],
          isDraft,
        };
      }

      dispatch(createBookingOrderFetch(payload));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const bookingOrders = createBooking.data?.bookingOrders;

    if (Array.isArray(bookingOrders) && bookingOrders.length > 0) {
      const orderNumbers = bookingOrders
        .map((v) => v.bookingOrderNo)
        .join(", ");
      const totalCreated =
        createBooking.data?.totalCreated ?? bookingOrders.length;
      MessageHandler().success(
        `${totalCreated} booking order(s) created with booking order no(s): ${orderNumbers}`,
      );
      router.push(ROUTE.SALES_MANAGEMENT.BOOKING_ORDER);
    }

    return () => {
      dispatch(bookingOrderActions.createBookingOrderClear());
    };
  }, [createBooking.data]);

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.SALES_MANAGEMENT.BOOKING_ORDER,
          },
          ...(IS_DROP_BASE
            ? [{ title: t("breadcrumb.2.addDropBase") }]
            : [{ title: t("breadcrumb.2.add") }]),
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.BOOKING_ORDER}
        isDirectToURL
      />
      <SalesManagementComponent.BookingForm
        form={form}
        type="create"
        onSubmit={handleSubmitForm}
      />
    </>
  );
};

export default BookingOrderAddPage;
