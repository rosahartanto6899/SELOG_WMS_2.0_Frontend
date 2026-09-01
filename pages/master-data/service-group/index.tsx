import PageLayout from "@sera-components/layout/page-layout";
import ServiceGroup from "@sera-components/pages/master-data/service-group";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const ServiceGroupPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "serviceGroup" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<ServiceGroup.InitialPage />}
    />
  );
};

export default connect()(ServiceGroupPage);
