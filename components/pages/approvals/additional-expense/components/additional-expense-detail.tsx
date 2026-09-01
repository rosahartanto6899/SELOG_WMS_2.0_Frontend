import Button from "@sera-components/button";
import ModalApproveReject from "@sera-components/modal/modal-approve-reject";
import RsFormBuilder from "@sera-components/rs-form-builder";
import MessageHandler from "@sera-libraries/message-handler";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import { useAppDispatch, useAppSelector } from "@sera-redux";
import { additionalExpenseActions } from "@sera-redux/slices/additional-expense.slice";
import { ROUTE } from "@sera-utils/constants/routes";
import { Flex, Form, Row, Space } from "antd";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AdditionalExpense = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense.form",
  });
  const session = useSession() as any;
  const router = useRouter();

  const shipmentExpenseId = router.query.shipmentExpenseId as string;
  const status = router.query.status as string;

  const roleName = session?.data?.user?.roleName;
  const approvalRoleName = router.query.role;
  const isSameRoleName = roleName === approvalRoleName;

  const isEligibleApproval =
    isSameRoleName && status.toLowerCase() === "waiting for approval";

  const [form] = Form.useForm();
  const ADDITIONAL_EXPENSE_CONFIG: ChildConfig[] = [
    {
      id: "fuel",
      type: "number",
      name: "fuel",
      label: t("additionalExpense.fuel.label"),
      prefix: "Rp.",
      placeholder: t("additionalExpense.fuel.placeholder"),
      disabled: true,
    },
    {
      id: "toll",
      type: "number",
      name: "toll",
      label: t("additionalExpense.toll.label"),
      prefix: "Rp.",
      placeholder: t("additionalExpense.toll.placeholder"),
      disabled: true,
    },
    {
      id: "mell",
      type: "number",
      name: "mell",
      label: t("additionalExpense.mell.label"),
      prefix: "Rp.",
      placeholder: t("additionalExpense.mell.placeholder"),
      disabled: true,
    },
    {
      id: "loadingUnloading",
      type: "number",
      name: "loadingUnloading",
      label: t("additionalExpense.loadingUnloading.label"),
      prefix: "Rp.",
      placeholder: t("additionalExpense.loadingUnloading.placeholder"),
      disabled: true,
    },
    {
      id: "harborCrossing",
      type: "number",
      name: "harborCrossing",
      label: t("additionalExpense.harborCrossing.label"),
      prefix: "Rp.",
      placeholder: t("additionalExpense.harborCrossing.placeholder"),
      disabled: true,
    },
    {
      id: "workerContributions",
      type: "number",
      name: "workerContributions",
      label: t("additionalExpense.workerContributions.label"),
      prefix: "Rp.",
      placeholder: t("additionalExpense.workerContributions.placeholder"),
      disabled: true,
    },
    {
      id: "security",
      type: "number",
      name: "security",
      label: t("additionalExpense.security.label"),
      prefix: "Rp.",
      placeholder: t("additionalExpense.security.placeholder"),
      disabled: true,
    },
    {
      id: "incentiveKm",
      type: "number",
      name: "incentiveKm",
      label: t("additionalExpense.incentiveKm.label"),
      prefix: "Rp.",
      placeholder: t("additionalExpense.incentiveKm.placeholder"),
      disabled: true,
    },
    {
      id: "incentiveDaily",
      type: "number",
      name: "incentiveDaily",
      label: t("additionalExpense.incentiveDaily.label"),
      prefix: "Rp.",
      placeholder: t("additionalExpense.incentiveDaily.placeholder"),
      disabled: true,
    },
    {
      id: "incentiveSio",
      type: "number",
      name: "incentiveSio",
      label: t("additionalExpense.incentiveSio.label"),
      prefix: "Rp.",
      placeholder: t("additionalExpense.incentiveSio.placeholder"),
      disabled: true,
    },
    {
      id: "note",
      type: "text",
      name: "note",
      label: t("additionalExpense.note.label"),
      placeholder: t("additionalExpense.note.placeholder"),
      disabled: true,
    },
    {
      id: "isBillToCustomer",
      type: "switch",
      name: "isBillToCustomer",
      label: t("additionalExpense.isBillToCustomer.label"),
      placeholder: t("additionalExpense.isBillToCustomer.placeholder"),
      options: ["Yes", "No"],
      disabled: true,
    },
    // {
    //   id: "approvalNote",
    //   type: "textarea",
    //   name: "approvalNote",
    //   label: t("additionalExpense.approvalNote.label"),
    //   placeholder: t("additionalExpense.approvalNote.placeholder"),
    //   disabled: true,
    // },
  ];

  const {
    detail: { data: additionalExpenseDetail },
  } = useAppSelector((state) => state.additionalExpense);

  const dispatch = useAppDispatch();

  const [modalData, setModalData] = useState<{
    decision: "approve" | "reject";
    show: boolean;
    data: null;
    reason: string;
  }>({
    data: null,
    show: false,
    decision: "approve",
    reason: "",
  });

  const DECISION_TYPES = {
    approve: {
      title: t("modal.approve.title"),
      subtitle: t("modal.approve.subtitle"),
      yesButton: t("modal.approve.button.yes"),
      noButton: t("modal.approve.button.no"),
    },
    reject: {
      title: t("modal.reject.title"),
      subtitle: t("modal.reject.subtitle"),
      yesButton: t("modal.reject.button.yes"),
      noButton: t("modal.reject.button.no"),
    },
  };

  const handleDecision = (val: "approve" | "reject") => {
    setModalData({ decision: val, show: true, data: null, reason: "" });
  };

  const handleConfirm = (reason?: string) => {
    const isApprove = modalData.decision === "approve";
    const callback = () => {
      MessageHandler().success(
        isApprove ? t("approveSuccess") : t("rejectSuccess"),
      );
      router.push(ROUTE.APPROVALS.ADDITIONAL_EXPENSE);

      setModalData((prev) => ({ ...prev, show: false }));
      dispatch(additionalExpenseActions.updateApprovalAdditionalExpenseClear());
    };

    dispatch(
      additionalExpenseActions.updateApprovalAdditionalExpenseFetch({
        referenceId: shipmentExpenseId,
        type: modalData.decision,
        note: isApprove ? undefined : reason,
        callback,
      }),
    );
  };

  useEffect(() => {
    if (isEmpty(additionalExpenseDetail)) return;

    form.setFieldsValue({
      fuel: additionalExpenseDetail?.fuel ?? "-",
      toll: additionalExpenseDetail?.toll ?? "-",
      mell: additionalExpenseDetail?.mell ?? "-",
      loadingUnloading: additionalExpenseDetail?.loadingUnloading ?? "-",
      harborCrossing: additionalExpenseDetail?.harborCrossing ?? "-",
      workerContributions: additionalExpenseDetail?.workerContributions ?? "-",
      security: additionalExpenseDetail?.security ?? "-",
      incentiveDaily: additionalExpenseDetail?.incentiveDaily ?? "-",
      incentiveKm: additionalExpenseDetail?.incentiveKM ?? "-",
      incentiveSio: additionalExpenseDetail?.incentiveSIO ?? "-",
      note: additionalExpenseDetail?.note ?? "-",
      // approvalNote: additionalExpenseDetail?.approvalNote ?? "-",
      isBillToCustomer: Boolean(additionalExpenseDetail?.isBillToCustomer),
    });
  }, [additionalExpenseDetail]);

  useEffect(() => {
    if (!shipmentExpenseId) return;
    dispatch(
      additionalExpenseActions.getAdditionalExpenseDetailFetch({
        id: shipmentExpenseId,
      }),
    );

    return () => {
      dispatch(additionalExpenseActions.getAdditionalExpenseDetailClear());
    };
  }, [shipmentExpenseId]);

  return (
    <>
      <Flex vertical gap={24}>
        <RsFormBuilder
          type={"create"}
          layout="vertical"
          name={""}
          form={form}
          onFinish={() => {}}
          onCancel={() => {}}
          configs={ADDITIONAL_EXPENSE_CONFIG}
          isHideFormButton
        />

        <Row justify={"end"}>
          <Space style={{ marginTop: "1rem" }} align="end" wrap>
            <Button
              type="primary"
              onClick={() => handleDecision("approve")}
              disabled={!isEligibleApproval}
            >
              {t("button.approve")}
            </Button>
            <Button
              onClick={() => handleDecision("reject")}
              disabled={!isEligibleApproval}
            >
              {t("button.reject")}
            </Button>
          </Space>
        </Row>
      </Flex>

      <ModalApproveReject
        type={modalData.decision}
        open={modalData.show}
        title={DECISION_TYPES[modalData.decision].title}
        okText={DECISION_TYPES[modalData.decision].yesButton}
        subtitle={DECISION_TYPES[modalData.decision].subtitle}
        onOk={handleConfirm}
        onCancel={() => setModalData((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
};

export default AdditionalExpense;
