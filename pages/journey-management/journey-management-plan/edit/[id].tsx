/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermission from "@sera-components/pages/journey-management/hooks/useGetPermission";
import JMPComponent from "@sera-components/pages/journey-management/jmp";
import MessageHandler from "@sera-libraries/message-handler";
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
  updateJMP: typeof jmpActions.updateJMPFetch;
}

const JMPEditPage = ({ loading, detailJMP, updateJMP }: JMPAddPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "jmp" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isUpdate } = useGetPermission("journey-management-plan");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/journey-management/journey-management-plan/edit");

  const onHandleUpdateJMP = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          updateJMP({
            id: id as string,
            specificCustomer: _values?.specificCustomer ? 1 : 0,
            customerId: _values?.customerId ?? null,
            jmpDetails: (_values?.jmpDetails ?? [])?.map(
              (_item: { location?: string }) => _item?.location,
            ),
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
      detailJMP({ id });
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
          url: ROUTE.JOURNEY_MANAGEMENT.JMP,
        },
        { title: t("breadcrumb.2.edit") },
      ]}
      backUrl={ROUTE.JOURNEY_MANAGEMENT.JMP}
      isDirectToURL
      withTab={false}
      content={
        <JMPComponent.Form
          type="update"
          form={form}
          loading={loading[jmpTypes.DETAIL_JMP] || loading[jmpTypes.UPDATE_JMP]}
          onSubmit={onHandleUpdateJMP}
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
  updateJMP: jmpActions.updateJMPFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(JMPEditPage);
