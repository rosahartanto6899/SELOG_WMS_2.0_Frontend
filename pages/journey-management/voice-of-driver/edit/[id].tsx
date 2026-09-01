/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermission from "@sera-components/pages/journey-management/hooks/useGetPermission";
import VoDComponent from "@sera-components/pages/journey-management/vod";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState } from "@sera-redux";
import { vodActions } from "@sera-redux/slices/voice-of-driver.slice";
import { LoadingState } from "@sera-types/loading.type";
import { VoDState, vodTypes } from "@sera-types/voice-of-driver.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface VoDEditPageProps {
  loading: LoadingState;
  vod: VoDState;
  detailVoD: typeof vodActions.detailVoDFetch;
  updateVoD: typeof vodActions.updateVoDFetch;
}

const VoDEditPage = ({
  loading,
  vod,
  detailVoD,
  updateVoD,
}: VoDEditPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "vod" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isUpdate } = useGetPermission("voice-of-driver");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/journey-management/voice-of-driver/edit");

  const onHandleUpdateVoD = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          updateVoD({
            id: id as string,
            status: _values?.status,
            note: _values?.note,
            ticketNumber: vod?.detailVoD?.data?.ticketNumber,
          });
        } catch (_error: any) {
          sendErrorHandlerApi(
            "onHandleCreateStock",
            36,
            isApiResponse(_error) ? _error : _error?.data?.message,
          );
        }
      })
      .catch((_error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        sendErrorHandler(
          "onHandleCreateStock",
          36,
          isApiResponse(_error) ? _error : "Validation form not pass",
          errorHandler,
        );
      });
  };

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

  if (!isUpdate) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.edit")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.JOURNEY_MANAGEMENT.VOD,
        },
        { title: t("breadcrumb.2.edit") },
      ]}
      backUrl={ROUTE.JOURNEY_MANAGEMENT.VOD}
      isDirectToURL
      withTab={false}
      content={
        <VoDComponent.Form
          type="update"
          form={form}
          loading={loading[vodTypes.DETAIL_VOD] || loading[vodTypes.UPDATE_VOD]}
          onSubmit={onHandleUpdateVoD}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  vod: state.vod,
});

const mapDispatchToProps = {
  detailVoD: vodActions.detailVoDFetch,
  updateVoD: vodActions.updateVoDFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(VoDEditPage);
