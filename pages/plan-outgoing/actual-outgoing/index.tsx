import PageLayout from "@sera-components/layout/page-layout";
import ActualOutgoingInitialPage from "@sera-components/pages/plan-outgoing/actual-outgoing/actual-outgoing-initial-page";
import { useTranslation } from "react-i18next";

/** Actual Outgoing — list hasil/antrean aktualisasi keluar (spec 005). */
const ActualOutgoingPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.page",
  });

  return (
    <PageLayout
      title={t("actualOutgoingTitle")}
      breadcrumb={[
        { title: t("outgoingBreadcrumb.0") },
        { title: t("outgoingBreadcrumb.1") },
      ]}
      isDirectToURL
      withTab={false}
      content={<ActualOutgoingInitialPage />}
    />
  );
};

export default ActualOutgoingPage;
