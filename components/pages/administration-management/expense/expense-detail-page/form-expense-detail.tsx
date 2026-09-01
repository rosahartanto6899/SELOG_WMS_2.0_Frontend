/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Modal from "@sera-components/modal";
import RsFormBuilder from "@sera-components/rs-form-builder";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { RootState } from "@sera-redux";
import { expenseActions } from "@sera-redux/slices/expense-monitoring.slice";
import {
  DetailExpensesDetail,
  ExpenseState,
  expenseTypes,
} from "@sera-types/expense-monitoring";
import { LoadingState } from "@sera-types/loading.type";
import { DATE_TO_FORM } from "@sera-utils/constants/common";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { isEmpty, isNull } from "lodash";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface FormExpenseDetailProps {
  open: boolean;
  data: DetailExpensesDetail | null;
  toggle: () => void;

  loading: LoadingState;
  expenseMonitoring: ExpenseState;
  updateDetailExpense: typeof expenseActions.updateDetailExpenseFetch;
}

const FormExpenseDetail = ({
  open,
  data,
  toggle,
  loading,
  expenseMonitoring,
  updateDetailExpense,
}: FormExpenseDetailProps) => {
  const [form] = Form.useForm();

  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.detail.expenseDetail.form",
  });

  const messageRequired = t("message.required");
  const messageRef = t("message.ref");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/expense-monitoring/expense-detail/form");

  const FORM_CONFIG = [
    {
      id: "umNumber",
      type: "text",
      name: "umNumber",
      label: t("input.umNumber.label"),
      placeholder: t("input.umNumber.placeholder"),
    },
    {
      id: "bphNumber",
      type: "text",
      name: "bphNumber",
      label: t("input.bphNumber.label"),
      placeholder: t("input.bphNumber.placeholder"),
    },
    {
      id: "transferredDate",
      type: "date",
      name: "transferredDate",
      label: t("input.transferredDate.label"),
      placeholder: t("input.transferredDate.placeholder"),
      rules: [{ required: true, message: messageRequired }],
    },
    {
      id: "amount",
      type: "number",
      name: "amount",
      prefix: "Rp.",
      label: t("input.amount.label"),
      placeholder: t("input.amount.placeholder"),
      rules: [{ required: true, message: messageRequired }],
    },
    {
      id: "adminFee",
      type: "number",
      name: "adminFee",
      prefix: "Rp.",
      label: t("input.adminFee.label"),
      placeholder: t("input.adminFee.placeholder"),
    },
    {
      id: "referenceNumber",
      type: "text",
      name: "referenceNumber",
      label: t("input.referenceNumber.label"),
      placeholder: t("input.referenceNumber.placeholder"),
      rules: [{ required: true, message: messageRequired }],
    },
    {
      id: "note",
      type: "text",
      name: "note",
      label: t("input.note.label"),
      placeholder: t("input.note.placeholder"),
    },
  ] as ChildConfig[];

  const onHandleUpdateExpense = () => {
    form.setFields([
      { name: "umNumber", errors: [] },
      { name: "bphNumber", errors: [] },
    ]);

    form
      .validateFields()
      .then((_values) => {
        try {
          if (isEmpty(_values?.umNumber) && isEmpty(_values?.bphNumber)) {
            form.setFields([
              { name: "umNumber", errors: [messageRef] },
              { name: "bphNumber", errors: [messageRef] },
            ]);
          } else {
            updateDetailExpense({ ..._values, id: data?.id });
          }
        } catch (_error: any) {
          sendErrorHandlerApi(
            "onHandleCreateStock",
            36,
            isApiResponse(_error) ? _error : _error?.data?.message,
          );
        }
      })
      .catch((_error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        sendErrorHandler(
          "onHandleCreateStock",
          36,
          isApiResponse(_error) ? _error : "Validation form not pass",
          errorHandler,
        );
      });
  };

  useEffect(() => {
    form.resetFields();
  }, []);

  useEffect(() => {
    if (isNull(data)) return;

    form.setFieldsValue({
      umNumber: data?.umNumber,
      bphNumber: data?.bphNumber,
      transferredDate: DATE_TO_FORM(data?.transferredDate),
      amount: data?.amount,
      adminFee: data?.adminFee,
      referenceNumber: data?.referenceNumber,
      note: data?.note,
    });
  }, [data]);

  useEffect(() => {
    setFormErrorHandle(form, expenseMonitoring?.updateDetailExpense?.error);
  }, [expenseMonitoring?.updateDetailExpense?.error]);

  return (
    <Modal
      open={open}
      title={`Termin ${data?.termin}`}
      width={1000}
      onCancel={toggle}
      closable
      destroyOnClose
    >
      <RsFormBuilder
        name="form-unit-activities"
        layout="vertical"
        form={form}
        type="update"
        configs={FORM_CONFIG}
        onFinish={onHandleUpdateExpense}
        onCancel={toggle}
        loading={loading[expenseTypes.UPDATE_DETAIL_EXPENSE]}
        disabled={loading[expenseTypes.UPDATE_DETAIL_EXPENSE]}
      />
    </Modal>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  expenseMonitoring: state.expenseMonitoring,
});

const mapDispatchToProps = {
  updateDetailExpense: expenseActions.updateDetailExpenseFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormExpenseDetail);
