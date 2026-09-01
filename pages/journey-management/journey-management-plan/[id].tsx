/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermission from "@sera-components/pages/journey-management/hooks/useGetPermission";
import JMPComponent from "@sera-components/pages/journey-management/jmp";
import { RootState } from "@sera-redux";
import { jmpActions } from "@sera-redux/slices/jmp.slice";
import { jmpTypes } from "@sera-types/jmp.type";
import { LoadingState } from "@sera-types/loading.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface JMPAddPageProps {
  loading: LoadingState;
  detailJMP: typeof jmpActions.detailJMPFetch;
}

const JMPAddPage = ({ loading, detailJMP }: JMPAddPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "jmp" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isRead } = useGetPermission("journey-management-plan");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/journey-management/journey-management-plan/[id]");

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    try {
      detailJMP({ id });
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
          url: ROUTE.JOURNEY_MANAGEMENT.JMP,
        },
        { title: t("breadcrumb.2.detail") },
      ]}
      backUrl={ROUTE.JOURNEY_MANAGEMENT.JMP}
      isDirectToURL
      withTab={false}
      content={
        <JMPComponent.Form
          type="detail"
          form={form}
          loading={loading[jmpTypes.DETAIL_JMP]}
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
  detailJMP: jmpActions.detailJMPFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(JMPAddPage);
