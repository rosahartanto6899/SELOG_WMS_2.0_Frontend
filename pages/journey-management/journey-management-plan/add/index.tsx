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
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface JMPAddPageProps {
  loading: LoadingState;
  createJMP: typeof jmpActions.createJMPFetch;
}

const JMPAddPage = ({ loading, createJMP }: JMPAddPageProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "jmp" });

  const [form] = Form.useForm();

  const { isCreate } = useGetPermission("journey-management-plan");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/journey-management/journey-management-plan/add");

  const onHandleCreateJMP = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          createJMP({
            origin: _values?.origin,
            destination: _values?.destination,
            tollUsage: _values?.tollUsage,
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

  if (!isCreate) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.add")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.JOURNEY_MANAGEMENT.JMP,
        },
        { title: t("breadcrumb.2.add") },
      ]}
      backUrl={ROUTE.JOURNEY_MANAGEMENT.JMP}
      isDirectToURL
      withTab={false}
      content={
        <JMPComponent.Form
          type="create"
          form={form}
          loading={loading[jmpTypes.CREATE_JMP]}
          onSubmit={onHandleCreateJMP}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  createJMP: jmpActions.createJMPFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(JMPAddPage);
