import PageLayout from "@sera-components/layout/page-layout";
import UploadStockAdjustmentUpsertBulk from "@sera-components/pages/support/stock-adjustment/upload-stock-adjustment-upsert-bulk";
import { useTranslation } from "react-i18next";

const UploadStockAdjustmentPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "inventoryStock.uploadStockAdjustment",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={<UploadStockAdjustmentUpsertBulk />}
    />
  );
};

export default UploadStockAdjustmentPage;
