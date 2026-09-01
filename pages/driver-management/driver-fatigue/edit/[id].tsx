import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import DriverManagementComponent from "@sera-components/pages/driver-management";
import useGetPermission from "@sera-components/pages/driver-management/hooks/useGetPermission";
import { ROUTE } from "@sera-utils/constants/routes";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const StockManagementDetailPage = () => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "driverFatigue" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isUpdate } = useGetPermission("driver-fatigue");

  if (!isUpdate || !id) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.detail")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.DRIVER_MANAGEMENT.DRIVER_FATIGUE,
        },
        { title: t("breadcrumb.2.update") },
      ]}
      backUrl={ROUTE.DRIVER_MANAGEMENT.DRIVER_FATIGUE}
      isDirectToURL
      withTab={false}
      content={
        <DriverManagementComponent.DriverFatigueFormPage
          type="update"
          form={form}
          date="-"
          driverName="-"
          // loading={loading[stockManagementTypes.DETAIL_VEHICLE]}
          onSubmit={() => {}}
          id={id as string}
        />
      }
    />
  );
};

export default StockManagementDetailPage;
