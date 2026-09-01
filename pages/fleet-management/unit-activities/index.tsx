import PageLayout from "@sera-components/layout/page-layout";
import UnitActivitiesComponent from "@sera-components/pages/fleet-management/unit-activities";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const UnitActivitiesPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "unitActivities" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<UnitActivitiesComponent.InitialPage />}
    />
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UnitActivitiesPage);
