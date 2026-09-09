import PageLayout from "@sera-components/layout/page-layout";
import PickingPage from "@sera-components/pages/plan-outgoing/outstanding-outgoing/picking-page";
import { ROUTE } from "@sera-utils/constants/routes";
import { useTranslation } from "react-i18next";

/** Picking worklist — ?id= headerId (parity halaman binning incoming). */
const PickingWorkPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.page",
  });

  return (
    <PageLayout
      title={t("pickingTitle")}
      breadcrumb={[
        { title: t("outstandingBreadcrumb.0") },
        { title: t("outstandingBreadcrumb.1") },
        { title: t("pickingTitle") },
      ]}
      backUrl={ROUTE.PLAN_OUTGOING.OUTSTANDING_OUTGOING}
      isDirectToURL
      withTab={false}
      content={<PickingPage />}
    />
  );
};

export default PickingWorkPage;
