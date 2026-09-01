import Card from "@sera-components/card";
import LoadingPage from "@sera-components/loading/loading-page";
import type { ComponentType } from "react";
import React, { FC, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";

type UpdateFormConfig = {
  title: string;
  Component: ComponentType;
};

export interface OrderStatusCancellationFormProps {
  type: "cancel" | "reschedule" | "reroute";
}

const CancelForm = lazy(() => import("./components/order-cancel-form"));
const RescheduleForm = lazy(() => import("./components/order-reschedule-form"));
const RerouteForm = lazy(() => import("./components/order-reroute-form"));

const OrderStatusCancellationForm: FC<OrderStatusCancellationFormProps> = ({
  type,
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "orderStatus" });

  const UPDATE_FORM_ENV: Record<
    OrderStatusCancellationFormProps["type"],
    UpdateFormConfig
  > = {
    cancel: {
      title: t("editForm.cancel.title"),
      Component: CancelForm,
    },
    reschedule: {
      title: t("editForm.reschedule.title"),
      Component: RescheduleForm,
    },
    reroute: {
      title: t("editForm.reroute.title"),
      Component: RerouteForm,
    },
  };

  const { title, Component } = UPDATE_FORM_ENV[type];
  return (
    <Card title={title}>
      <Suspense fallback={<LoadingPage />}>
        <Component />
      </Suspense>
    </Card>
  );
};

export default OrderStatusCancellationForm;
