/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermission from "@sera-components/pages/journey-management/hooks/useGetPermission";
import VoDComponent from "@sera-components/pages/journey-management/vod";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState } from "@sera-redux";
import { vodActions } from "@sera-redux/slices/voice-of-driver.slice";
import { LoadingState } from "@sera-types/loading.type";
import { vodTypes } from "@sera-types/voice-of-driver.type";
import { DATE_FORMAT, FORMAT_DATE_TIME } from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface VoDAddPageProps {
  loading: LoadingState;
  createVoD: typeof vodActions.createVoDFetch;
}

const VoDAddPage = ({ loading, createVoD }: VoDAddPageProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "vod" });

  const [form] = Form.useForm();

  const { isCreate } = useGetPermission("voice-of-driver");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/journey-management/voice-of-driver/add");

  const onHandleCreateVoD = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          createVoD({
            category: _values?.category ?? "",
            shipmentId: _values?.shipmentNo ?? _values?.referenceNo ?? "",
            voiceType: _values?.voiceType ?? "",
            voiceDetail: _values?.voiceDetail ?? "",
            position: _values?.position ?? "",
            dateOfAccident: DATE_FORMAT(
              _values?.dateOfAccident,
              FORMAT_DATE_TIME,
            ),
            coordinate: _values?.coordinate ?? "",
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

  if (!isCreate) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.add")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.JOURNEY_MANAGEMENT.VOD,
        },
        { title: t("breadcrumb.2.add") },
      ]}
      backUrl={ROUTE.JOURNEY_MANAGEMENT.VOD}
      isDirectToURL
      withTab={false}
      content={
        <VoDComponent.Form
          type="create"
          form={form}
          loading={loading[vodTypes.CREATE_VOD]}
          onSubmit={onHandleCreateVoD}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  createVoD: vodActions.createVoDFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(VoDAddPage);
