import PageLayout from "@sera-components/layout/page-layout";
import UploadIncomingAhmUpsertBulk from "@sera-components/pages/plan-incoming/upload-incoming-ahm/upload-incoming-ahm-upsert-bulk";
import { useTranslation } from "react-i18next";

const UploadIncomingAhmPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.uploadAhm",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<UploadIncomingAhmUpsertBulk />}
    />
  );
};

export default UploadIncomingAhmPage;
