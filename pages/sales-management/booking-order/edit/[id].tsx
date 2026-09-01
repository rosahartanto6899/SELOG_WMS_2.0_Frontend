import PageHeader from "@sera-components/page-header";
import SalesManagementComponent from "@sera-components/pages/sales-management";
import MessageHandler from "@sera-libraries/message-handler";
import {
  bookingOrderActions,
  updateBookingOrderFetch,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { UpdateBookingOrderPayload } from "@sera-types/booking-order.type";
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

const BookingOrderEditPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "bookingOrder" });
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { updateBooking, detailBooking } = useAppSelector(
    (state) => state.bookingOrder,
  );
  const router = useRouter();
  const id = router.query.id as string;

  const handleSubmitForm = async ({ isDraft, isDropBase }: onSubmitProps) => {
    let payload: UpdateBookingOrderPayload = {};
    try {
      const res = await form.validateFields();
      if (isDropBase) {
        payload = {
          isDropBase: isDropBase,
          branchId: res?.branchOrder,
          salesDealing: res?.salesDealing,
          salesServicing: res?.salesServicing,
          pickUpDate: dayjs(res?.pickUpDate).format("YYYY-MM-DD"),
          additionalRequests: res?.additionalRequest || [],
          shipmentDetail:
            res?.shipmentDetails?.map((v: any) => ({
              notes: v?.notes,
              vehicleId: v?.licensePlate,
              pickupHour: dayjs(v?.pickupHour).format("HH:mm"),
              routes: v?.routes?.map((route: any) => route?.customerRouteId),
              drivers: v?.drivers,
            }))[0] || undefined,
          isDraft,
        };
      } else {
        const isRitase = res?.shipmentType?.toLowerCase() === "ritase";
        payload = {
          branchId: res?.branchOrder,
          shipmentType: res?.shipmentType,
          salesDealing: res?.salesDealing,
          salesServicing: res?.salesServicing,
          pickUpDate: dayjs(res?.pickUpDate).format("YYYY-MM-DD"),
          additionalRequests: res?.additionalRequest || [],
          shipmentDetail:
            res?.shipmentDetails?.map((v: any) => ({
              customerRouteId: v?.customerRouteId,
              notes: v?.notes,
              pickupHour: dayjs(v?.pickupHour).format("HH:mm"),
              ...(isRitase ? { qtyUnit: Number(v?.qtyUnit) } : {}),
              ...(!isRitase
                ? { shipmentId: detailBooking.data.shipmentDetail?.shipmentId }
                : {}),
              ...(!isRitase ? { qtyDriver: Number(v?.qtyDriver) } : {}),
              ...(!isRitase ? { drivers: v?.drivers } : {}),
              ...(!isRitase ? { vehicleId: v?.licensePlate } : {}),
            }))[0] || undefined,
          isDraft,
        };
      }
      dispatch(updateBookingOrderFetch({ ...payload, id }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (Object.keys(updateBooking.data).length) {
      MessageHandler().success("Booking order has been successfully updated");
      router.push(ROUTE.SALES_MANAGEMENT.BOOKING_ORDER);
    }

    return () => {
      dispatch(bookingOrderActions.updateBookingOrderClear());
    };
  }, [updateBooking]);

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
          { title: t("breadcrumb.2.edit") },
        ]}
        backUrl={ROUTE.SALES_MANAGEMENT.BOOKING_ORDER}
        isDirectToURL
      />
      <SalesManagementComponent.BookingForm
        form={form}
        type="edit"
        onSubmit={handleSubmitForm}
      />
    </>
  );
};

export default BookingOrderEditPage;
