/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermission from "@sera-components/pages/journey-management/hooks/useGetPermission";
import VoDComponent from "@sera-components/pages/journey-management/vod";
import { RootState } from "@sera-redux";
import { vodActions } from "@sera-redux/slices/voice-of-driver.slice";
import { LoadingState } from "@sera-types/loading.type";
import { vodTypes } from "@sera-types/voice-of-driver.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface VoDDetailPageProps {
  loading: LoadingState;
  detailVoD: typeof vodActions.detailVoDFetch;
}

const VoDDetailPage = ({ loading, detailVoD }: VoDDetailPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "vod" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isRead } = useGetPermission("voice-of-driver");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/journey-management/voice-of-driver/[id]");

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    try {
      detailVoD({ id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 69, error);
      else sendErrorHandler("useEffect", 69, error?.data?.message);
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
          url: ROUTE.JOURNEY_MANAGEMENT.VOD,
        },
        { title: t("breadcrumb.2.detail") },
      ]}
      backUrl={ROUTE.JOURNEY_MANAGEMENT.VOD}
      isDirectToURL
      withTab={false}
      content={
        <VoDComponent.Form
          type="detail"
          form={form}
          loading={loading[vodTypes.DETAIL_VOD]}
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
  detailVoD: vodActions.detailVoDFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(VoDDetailPage);
