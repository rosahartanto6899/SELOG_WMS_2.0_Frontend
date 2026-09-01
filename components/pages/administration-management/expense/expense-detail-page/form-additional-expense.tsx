/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import Error404 from "@sera-components/error-boundary/Error404";
import RsFormBuilder from "@sera-components/rs-form-builder";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { orderStatusActions, RootState } from "@sera-redux";
import { expenseActions } from "@sera-redux/slices/expense-monitoring.slice";
import { ExpenseState, expenseTypes } from "@sera-types/expense-monitoring";
import { LoadingState } from "@sera-types/loading.type";
import {
  OrderStatusState,
  orderStatusTypes,
} from "@sera-types/order-status.type";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import useGetPermission from "../../hooks/useGetPermission";

interface FormAdditionalExpenseProps {
  toggle: () => void;
  loading: LoadingState;
  orderStatus: OrderStatusState;
  expenseMonitoring: ExpenseState;
  getOrderStatusDetail: typeof orderStatusActions.getOrderStatusDetailFetch;
  createAddExpenses: typeof expenseActions.createAddExpensesFetch;
}

export const CONST_YES_NO = ["Yes", "No"];

const FormAdditionalExpense = ({
  toggle,
  loading,
  orderStatus,
  expenseMonitoring,
  getOrderStatusDetail,
  createAddExpenses,
}: FormAdditionalExpenseProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.detail.additionalExpense.form",
  });

  const [form] = Form.useForm();
  const { id } = router.query;
  const { isCreate } = useGetPermission("expense-monitoring");

  const isLoading =
    loading[orderStatusTypes.GET_ORDER_STATUS_DETAIL] ||
    loading[expenseTypes.CREATE_ADD_EXPENSES];

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/expense-monitoring/detail/additional-expense/add");

  const FORM_CONFIG = [
    {
      id: "fuel",
      type: "number",
      name: "fuel",
      label: t("input.fuel.label"),
      placeholder: t("input.fuel.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "toll",
      type: "number",
      name: "toll",
      label: t("input.toll.label"),
      placeholder: t("input.toll.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "mell",
      type: "number",
      name: "mell",
      label: t("input.mell.label"),
      placeholder: t("input.mell.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "loadingUnloading",
      type: "number",
      name: "loadingUnloading",
      label: t("input.loadingUnloading.label"),
      placeholder: t("input.loadingUnloading.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "harborCrossing",
      type: "number",
      name: "harborCrossing",
      label: t("input.harborCrossing.label"),
      placeholder: t("input.harborCrossing.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "workerContributions",
      type: "number",
      name: "workerContributions",
      label: t("input.workerContributions.label"),
      placeholder: t("input.workerContributions.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "security",
      type: "number",
      name: "security",
      label: t("input.security.label"),
      placeholder: t("input.security.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "incentiveKM",
      type: "number",
      name: "incentiveKM",
      label: t("input.incentiveKM.label"),
      placeholder: t("input.incentiveKM.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "incentiveDaily",
      type: "number",
      name: "incentiveDaily",
      label: t("input.incentiveDaily.label"),
      placeholder: t("input.incentiveDaily.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "incentiveSIO",
      type: "number",
      name: "incentiveSIO",
      label: t("input.incentiveSIO.label"),
      placeholder: t("input.incentiveSIO.placeholder"),
      prefix: "Rp.",
    },
    {
      id: "note",
      type: "text",
      name: "note",
      label: t("input.note.label"),
      placeholder: t("input.note.placeholder"),
      maxLength: 100,
      showCount: true,
    },
    {
      id: "isBillToCustomer",
      type: "switch",
      name: "isBillToCustomer",
      label: t("input.isBillToCustomer.label"),
      placeholder: t("input.isBillToCustomer.placeholder"),
      options: CONST_YES_NO,
    },
  ] as ChildConfig[];

  const onHandleCreateExpense = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          const _shipment = orderStatus?.detail?.data?.shipment;

          createAddExpenses({
            shipmentId: id as string,
            branchId: _shipment?.branchId ?? "",
            shipmentNo: _shipment?.shipmentNo ?? "",
            shipmentType: _shipment?.shipmentType ?? "",
            customerName: _shipment?.customerName ?? "",
            fuel: Number(_values?.fuel) || 0,
            toll: Number(_values?.toll) || 0,
            mell: Number(_values?.mell) || 0,
            loadingUnloading: Number(_values?.loadingUnloading) || 0,
            harborCrossing: Number(_values?.harborCrossing) || 0,
            workerContributions: Number(_values?.workerContributions) || 0,
            security: Number(_values?.security) || 0,
            incentiveKM: Number(_values?.incentiveKM) || 0,
            incentiveDaily: Number(_values?.incentiveDaily) || 0,
            incentiveSIO: Number(_values?.incentiveSIO) || 0,
            isBillToCustomer: Number(_values?.isBillToCustomer) ? 1 : 0,
            note: _values?.note ?? "",
          });
        } catch (_error: any) {
          sendErrorHandlerApi(
            "onHandleCreateExpense",
            36,
            isApiResponse(_error) ? _error : _error?.data?.message,
          );
        }
      })
      .catch((_error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({
          content: t("message.default"),
        });

        sendErrorHandler(
          "onHandleCreateExpense",
          36,
          isApiResponse(_error) ? _error : "Validation form not pass",
          errorHandler,
        );
      });
  };

  useEffect(() => {
    form.resetFields();
    if (!id || typeof id !== "string") return;

    try {
      getOrderStatusDetail({ id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 69, error);
      else sendErrorHandler("useEffect", 69, error?.data?.message);
    }

    return () => form.resetFields();
  }, [id]);

  useEffect(() => {
    setFormErrorHandle(form, expenseMonitoring?.createAddExpenses?.error);
  }, [expenseMonitoring?.createAddExpenses?.error]);

  if (!isCreate) return <Error404 />;

  return (
    <Card title={t("title")}>
      <RsFormBuilder
        name="form-unit-activities"
        layout="vertical"
        form={form}
        type="update"
        configs={FORM_CONFIG}
        onFinish={onHandleCreateExpense}
        onCancel={toggle}
        loading={isLoading}
        disabled={isLoading || Boolean(orderStatus?.detail?.error)}
        cancelDisable={isLoading || false}
      />
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  orderStatus: state.orderStatus,
  expenseMonitoring: state.expenseMonitoring,
});

const mapDispatchToProps = {
  getOrderStatusDetail: orderStatusActions.getOrderStatusDetailFetch,
  createAddExpenses: expenseActions.createAddExpensesFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormAdditionalExpense);
