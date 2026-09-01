import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import JourneyMaganegement from "@sera-components/pages/journey-management";
import useGetPermission from "@sera-components/pages/journey-management/hooks/useGetPermission";
import { ROUTE } from "@sera-utils/constants/routes";
import router from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";

const BookingOrderDetailPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "tracingAndTracking" });
  const { id } = router.query;

  const { isRead } = useGetPermission("tracing-and-tracking");

  if (!isRead || !id) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.detail")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.JOURNEY_MANAGEMENT.TRACING_AND_TRACKING,
        },
        { title: t("breadcrumb.2.detail") },
      ]}
      backUrl={ROUTE.JOURNEY_MANAGEMENT.TRACING_AND_TRACKING}
      isDirectToURL
      withTab={false}
      content={
        <JourneyMaganegement.TracingTrackingDetailPage id={id as string} />
      }
    />
  );
};

export default BookingOrderDetailPage;
