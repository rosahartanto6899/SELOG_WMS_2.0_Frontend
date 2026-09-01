/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermissionFleetManagement from "@sera-components/pages/fleet-management/hooks/useGetPermission";
import UnitActivitiesComponent from "@sera-components/pages/fleet-management/unit-activities";
import { RootState, unitActivityActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { unitActivityTypes } from "@sera-types/unit-activity";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface UnitMaintenaceDetailPageProps {
  loading: LoadingState;
  getUnitDetail: typeof unitActivityActions.getUnitDetailFetch;
}

const UnitMaintenaceDetailPage = ({
  loading,
  getUnitDetail,
}: UnitMaintenaceDetailPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "unitActivities" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isRead } = useGetPermissionFleetManagement("unit-activities");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/unit-activity/edit");

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    try {
      getUnitDetail({ id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 38, error);
      else sendErrorHandler("useEffect", 38, error?.data?.message);
    }

    return () => form.resetFields();
  }, [id]);

  if (!isRead) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.detail")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.FLEET_MANAGEMENT.UNIT_ACTIVITIES,
        },
        { title: t("breadcrumb.2.detail") },
      ]}
      backUrl={ROUTE.FLEET_MANAGEMENT.UNIT_ACTIVITIES}
      isDirectToURL
      withTab={false}
      content={
        <UnitActivitiesComponent.Form
          type="detail"
          form={form}
          loading={loading[unitActivityTypes.GET_UNIT_DETAIL]}
          onSubmit={() => {}}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  getUnitDetail: unitActivityActions.getUnitDetailFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitMaintenaceDetailPage);
