import PageLayout from "@sera-components/layout/page-layout";
import ApprovalsManagementComponent from "@sera-components/pages/approvals";
import { ROUTE } from "@sera-utils/constants/routes";
import { useTranslation } from "react-i18next";

const AdditionalExpenseDetailPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[
        {
          title: t("breadcrumb.0"),
        },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.APPROVALS.ADDITIONAL_EXPENSE,
        },
        { title: t("breadcrumb.2") },
      ]}
      backUrl={ROUTE.APPROVALS.ADDITIONAL_EXPENSE}
      isDirectToURL
      withTab={false}
      content={<ApprovalsManagementComponent.AdditionalExpenseDetail />}
    />
  );
};

export default AdditionalExpenseDetailPage;
