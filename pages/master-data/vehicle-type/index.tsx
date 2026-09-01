import PageLayout from "@sera-components/layout/page-layout";
import VehicleTypeComponent from "@sera-components/pages/master-data/master-vehicle-type";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const MasterVehicleTypePage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "vehicleType" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[
        { title: t("breadcrumb.0.title") },
        { title: t("breadcrumb.1.title") },
      ]}
      content={<VehicleTypeComponent.InitialPage />}
    />
  );
};

export default connect()(MasterVehicleTypePage);
