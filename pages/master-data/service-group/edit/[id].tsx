/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import useGetPermissionMasterData from "@sera-components/pages/master-data/hooks/useGetPermission";
import ServiceGroup from "@sera-components/pages/master-data/service-group";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState, serviceGroupActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { serviceGroupTypes } from "@sera-types/service-group.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface ServiceGroupEditPageProps {
  loading: LoadingState;
  detailServiceGroup: typeof serviceGroupActions.detailServiceGroupFetch;
  updateServiceGroup: typeof serviceGroupActions.updateServiceGroupFetch;
}

const ServiceGroupEditPage = ({
  loading,
  detailServiceGroup,
  updateServiceGroup,
}: ServiceGroupEditPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "serviceGroup" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isUpdate } = useGetPermissionMasterData("service-group");
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/master-branch/edit/[id]/index");

  const onHandleUpdateServiceGroup = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          id: id as string,
          name: values?.name,
          branchId: values?.branchId,
        };

        try {
          updateServiceGroup(formData);
        } catch (error: any) {
          if (isApiResponse(error)) {
            sendErrorHandlerApi("onHandleUpdateServiceGroup", 0, error);
          } else {
            sendErrorHandler(
              "onHandleUpdateServiceGroup",
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
            "onHandleUpdateServiceGroup",
            0,
            error,
            errorHandler,
          );
        } else {
          sendErrorHandler(
            "onHandleUpdateServiceGroup",
            0,
            "Validation form not pass",
            errorHandler,
          );
        }
      });
  };

  useEffect(() => {
    if (id) {
      try {
        detailServiceGroup({ id: id as string });
      } catch (error: any) {
        if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 62, error);
        else sendErrorHandler("useEffect", 62, error?.data?.message);
      }
    }
    return () => form.resetFields();
  }, [id]);

  if (!isUpdate) return <Error404 />;

  return (
    <>
      <PageHeader
        title={t("breadcrumb.2.edit")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          { title: t("breadcrumb.1"), url: ROUTE.MASTER_DATA.SERVICE_GROUP },
          { title: t("breadcrumb.2.edit") },
        ]}
        backUrl={ROUTE.MASTER_DATA.SERVICE_GROUP}
        isDirectToURL
      />

      <ServiceGroup.Form
        type="update"
        form={form}
        loading={loading[serviceGroupTypes.CREATE_SERVICE_GROUP]}
        onSubmit={onHandleUpdateServiceGroup}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  detailServiceGroup: serviceGroupActions.detailServiceGroupFetch,
  updateServiceGroup: serviceGroupActions.updateServiceGroupFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceGroupEditPage);
