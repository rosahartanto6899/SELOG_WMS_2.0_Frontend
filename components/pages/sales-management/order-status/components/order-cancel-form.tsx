import Modal from "@sera-components/modal";
import RsFormBuilder from "@sera-components/rs-form-builder";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  masterDataActions,
  orderStatusActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { masterDataTypes } from "@sera-types/master-data.type";
import { orderStatusTypes } from "@sera-types/order-status.type";
import { ROUTE } from "@sera-utils/constants/routes";
import Utils from "@sera-utils/utils";
import { Form } from "antd";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ModalConfirmationOrder from "./order-modal-confirmation";

const CancelForm = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "orderStatus.editForm",
  });

  const router = useRouter();
  const [form] = Form.useForm();

  const id = router.query.id as string;

  const [modalData, setModalData] = useState<{
    data: any;
    show: boolean;
  }>({
    data: null,
    show: false,
  });

  const {
    getShipmentCancellationReasons: {
      data: dropdownShipmentCancellationReasons,
    },
  } = useAppSelector((state) => state.masterData);

  const {
    detail: { data: orderStatusDetail },
  } = useAppSelector((state) => state.orderStatus);

  const loading = useAppSelector((state) => state.loading);

  const requiredMessage = t("message");

  const len =
    orderStatusDetail?.shipment?.shipmentDetail?.routeLocations?.length ?? 1;

  const shipmentCancellationForm = {
    customerName: orderStatusDetail?.shipment?.customerName || "-",
    shipmentNo: orderStatusDetail?.shipment?.shipmentNo || "-",
    shipmentType: orderStatusDetail?.shipment?.shipmentType || "-",
    bookingNo: orderStatusDetail?.shipment?.bookingOrderNo || "-",
    destination:
      orderStatusDetail?.shipment?.shipmentDetail?.routeLocations[0]
        ?.locationName,
    origin:
      orderStatusDetail?.shipment?.shipmentDetail?.routeLocations[len - 1]
        ?.locationName,
    pickupDate: orderStatusDetail?.shipment?.pickUpDate,
  };

  const FORM_CONFIG = [
    {
      id: "bookingNo",
      type: "text",
      name: "bookingNo",
      label: t("input.bookingNo.label"),
      placeholder: t("input.bookingNo.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "shipmentNo",
      type: "text",
      name: "shipmentNo",
      label: t("input.shipmentNo.label"),
      placeholder: t("input.shipmentNo.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "shipmentType",
      type: "text",
      name: "shipmentType",
      label: t("input.shipmentType.label"),
      placeholder: t("input.shipmentType.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "customerName",
      type: "text",
      name: "customerName",
      label: t("input.customerName.label"),
      placeholder: t("input.customerName.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "origin",
      type: "text",
      name: "origin",
      label: t("input.origin.label"),
      placeholder: t("input.origin.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "destination",
      type: "text",
      name: "destination",
      label: t("input.destination.label"),
      placeholder: t("input.destination.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "pickupDate",
      type: "text",
      name: "pickupDate",
      label: t("input.pickupDate.label"),
      placeholder: t("input.pickupDate.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "cancellationReason",
      type: "select",
      name: "cancellationReason",
      label: t("input.cancellationReason.label"),
      placeholder: t("input.cancellationReason.placeholder"),
      options: dropdownShipmentCancellationReasons.map((v) => ({
        label: v.name,
        value: v.id,
      })),
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "chronology",
      type: "textarea",
      name: "chronology",
      label: t("input.chronology.label"),
      placeholder: t("input.chronology.placeholder"),
      maxLength: 200,
      showCount: true,
    },
  ] as ChildConfig[];

  const { withDash } = Utils();

  useEffect(() => {
    if (isEmpty(orderStatusDetail)) return;
    form.setFieldsValue(withDash(shipmentCancellationForm));

    return () => {
      form.resetFields([]);
    };
  }, [orderStatusDetail]);

  useEffect(() => {
    dispatch(masterDataActions.getShipmentCancellationReasonsFetch());

    return () => {
      dispatch(masterDataActions.getShipmentCancellationReasonsClear());
    };
  }, []);

  const handleSubmit = (value: any) => {
    try {
      setModalData({
        data: {
          ...value,
          cancellationReason:
            dropdownShipmentCancellationReasons.find(
              (o) => o.id === value?.cancellationReason,
            )?.name || "-",
        },
        show: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirm = async () => {
    const value = await form.validateFields();

    const callback = () => {
      MessageHandler().success(t("cancelSuccess"));
      router.push(ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS);

      dispatch(orderStatusActions.updateCancelOrderStatusClear());
    };

    dispatch(
      orderStatusActions.updateCancelOrderStatusFetch({
        cancellationReason: value?.cancellationReason,
        shipmentId: id,
        chronology: value?.chronology,
        callback,
      }),
    );
  };

  return (
    <>
      <RsFormBuilder
        name="form-cancel"
        type={"create"}
        layout="vertical"
        form={form}
        configs={FORM_CONFIG}
        onFinish={handleSubmit}
        onCancel={() => router.push(ROUTE.SALES_MANAGEMENT.SHIPMENT_STATUS)}
        cancelText={t("button.cancel")}
        loading={loading[masterDataTypes.GET_SHIPMENT_CANCELLATION_REASONS]}
      />

      <Modal.Confirm
        title={t("modalCancel.title")}
        open={modalData.show}
        okText={t("button.submit")}
        cancelText={t("button.close")}
        width={"75%"}
        destroyOnClose
        okButtonProps={{
          disabled: loading[orderStatusTypes.UPDATE_CANCEL_ORDER_STATUS],
        }}
        cancelButtonProps={{
          disabled: loading[orderStatusTypes.UPDATE_CANCEL_ORDER_STATUS],
        }}
        onOk={handleConfirm}
        onCancel={() => {
          const isLoadingUpdate =
            loading[orderStatusTypes.UPDATE_CANCEL_ORDER_STATUS];
          if (!isLoadingUpdate) {
            setModalData({ show: false, data: null });
          }
        }}
      >
        <ModalConfirmationOrder data={modalData.data} />
      </Modal.Confirm>
    </>
  );
};

export default CancelForm;
