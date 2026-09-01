import PageLayout from "@sera-components/layout/page-layout";
import JourneyMaganegement from "@sera-components/pages/journey-management";
import React from "react";
import { useTranslation } from "react-i18next";

const TracingAndTrackingPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "tracingAndTracking" });
  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<JourneyMaganegement.TracingTrackingInitialPage />}
    />
  );
};

export default TracingAndTrackingPage;
