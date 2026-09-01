import PageLayout from "@sera-components/layout/page-layout";
import PairingMatchingComponent from "@sera-components/pages/operation-management/pairing-matching";
import { useTranslation } from "react-i18next";

const PairingMatchingPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "pairingMatching" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<PairingMatchingComponent.InitialPage />}
    />
  );
};

export default PairingMatchingPage;
