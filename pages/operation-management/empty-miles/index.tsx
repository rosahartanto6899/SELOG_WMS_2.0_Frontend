import PageLayout from "@sera-components/layout/page-layout";
import OperationManagement from "@sera-components/pages/operation-management";
import { useTranslation } from "react-i18next";

const ExpensesPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "emptyMiles",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<OperationManagement.EmptyMilesInitialPage />}
    />
  );
};

export default ExpensesPage;
