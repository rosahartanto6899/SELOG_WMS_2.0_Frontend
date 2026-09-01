import PageLayout from "@sera-components/layout/page-layout";
import LocationComponent from "@sera-components/pages/master-data/locations";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const MasterLocationPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "location" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<LocationComponent.InitialPage />}
    />
  );
};

export default connect()(MasterLocationPage);
