import PageLayout from "@sera-components/layout/page-layout";
import PairingMatchingOpsInintialPage from "@sera-components/pages/operation-management/pairing-matching-ops/pairing-matching-ops-initial-page";
import { useTranslation } from "react-i18next";

const PairingMatchingOpsPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "pairingMatchingOps" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<PairingMatchingOpsInintialPage />}
    />
  );
};

export default PairingMatchingOpsPage;
