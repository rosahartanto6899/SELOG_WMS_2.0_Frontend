/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import useGetPermissionMasterData from "@sera-components/pages/master-data/hooks/useGetPermission";
import ServiceGroup from "@sera-components/pages/master-data/service-group";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState, serviceGroupActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import {
  ServiceGroupState,
  serviceGroupTypes,
} from "@sera-types/service-group.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface ServiceGroupAddPageProps {
  loading: LoadingState;
  serviceGroups: ServiceGroupState;
  createServiceGroup: typeof serviceGroupActions.createServiceGroupFetch;
  createServiceGroupClear: typeof serviceGroupActions.createServiceGroupClear;
}

const ServiceGroupAddPage = ({
  loading,
  createServiceGroup,
}: ServiceGroupAddPageProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "serviceGroup" });

  const [form] = Form.useForm();

  const { isCreate } = useGetPermissionMasterData("service-group");
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/master-branch/add/index");

  const onHandleCreateServiceGroup = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = { name: values?.name, branchId: values?.branchId };

        try {
          createServiceGroup(formData);
        } catch (error: any) {
          if (isApiResponse(error)) {
            sendErrorHandlerApi("onHandleCreateServiceGroup", 0, error);
          } else {
            sendErrorHandler(
              "onHandleCreateServiceGroup",
              0,
              error?.data?.message,
            );
          }
        }
      })
      .catch((error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        if (isApiResponse(error)) {
          sendErrorHandlerApi(
            "onHandleCreateServiceGroup",
            0,
            error,
            errorHandler,
          );
        } else {
          sendErrorHandler(
            "onHandleCreateServiceGroup",
            0,
            "Validation form not pass",
            errorHandler,
          );
        }
      });
  };

  if (!isCreate) return <Error404 />;

  return (
    <>
      <PageHeader
        title={t("breadcrumb.2.add")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          { title: t("breadcrumb.1"), url: ROUTE.MASTER_DATA.SERVICE_GROUP },
          { title: t("breadcrumb.2.add") },
        ]}
        backUrl={ROUTE.MASTER_DATA.SERVICE_GROUP}
        isDirectToURL
      />

      <ServiceGroup.Form
        type="create"
        form={form}
        loading={loading[serviceGroupTypes.CREATE_SERVICE_GROUP]}
        onSubmit={onHandleCreateServiceGroup}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  serviceGroups: state.serviceGroups,
});

const mapDispatchToProps = {
  createServiceGroup: serviceGroupActions.createServiceGroupFetch,
  createServiceGroupClear: serviceGroupActions.createServiceGroupClear,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceGroupAddPage);
