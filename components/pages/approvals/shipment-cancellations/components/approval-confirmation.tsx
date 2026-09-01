import Card from "@sera-components/card";
import LoadingPage from "@sera-components/loading/loading-page";
import StatusTag from "@sera-components/status-tag";
import MessageHandler from "@sera-libraries/message-handler";
import { ROUTE } from "@sera-utils/constants/routes";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import type { ComponentType } from "react";
import React, { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";

type UpdateFormConfig = {
  title: string;
  Component: ComponentType<{ isApproval: boolean }>;
};

export type ApprovalConfirmationType = "cancel" | "reschedule" | "reroute";

const CancelForm = lazy(
  () => import("./approval-confirmation-components/order-cancel-form"),
);
const RescheduleForm = lazy(
  () => import("./approval-confirmation-components/order-reschedule-form"),
);
const RerouteForm = lazy(
  () => import("./approval-confirmation-components/order-reroute-form"),
);

const ApprovalConfirmationPage = () => {
  const router = useRouter();
  const session = useSession() as any;
  const type = router.query.type as ApprovalConfirmationType;
  const { t } = useTranslation(undefined, {
    keyPrefix: "shipmentCancellations.form.approvalConfirmation",
  });

  if (!type) {
    MessageHandler().error("Type is not defined");
    return router.push(ROUTE.APPROVALS.SHIPMENT_CANCELLATIONS);
  }

  const status = router.query.status as string;

  const roleName = session?.data?.user?.roleName;
  const approvalRoleName = router.query.role;
  const isWaitingForApproval = status.toLowerCase() === "waiting for approval";
  const isSameRoleName = roleName === approvalRoleName;

  const UPDATE_FORM_ENV: Record<ApprovalConfirmationType, UpdateFormConfig> = {
    cancel: {
      title: t("cancel.title"),
      Component: CancelForm,
    },
    reschedule: {
      title: t("reschedule.title"),
      Component: RescheduleForm,
    },
    reroute: {
      title: t("reroute.title"),
      Component: RerouteForm,
    },
  };

  const { title, Component } = UPDATE_FORM_ENV[type];
  return (
    <Card title={title} extra={<StatusTag value={status} />}>
      <Suspense fallback={<LoadingPage />}>
        <Component isApproval={isSameRoleName && isWaitingForApproval} />
      </Suspense>
    </Card>
  );
};

export default ApprovalConfirmationPage;
