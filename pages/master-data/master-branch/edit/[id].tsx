/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import useGetPermissionMasterData from "@sera-components/pages/master-data/hooks/useGetPermission";
import MasterBranch from "@sera-components/pages/master-data/master-branch";
import MessageHandler from "@sera-libraries/message-handler";
import { businessAreaActions, RootState } from "@sera-redux";
import { businessAreaTypes } from "@sera-types/business-area.type";
import { LoadingState } from "@sera-types/loading.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import Utils from "@sera-utils/utils";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface MasterBranchAddProps {
  loading: LoadingState;
  getBusinessAreaDetail: typeof businessAreaActions.getBusinessAreaDetailFetch;
  updateBusinessAreaFetch: typeof businessAreaActions.updateBusinessAreaFetch;
}
const MasterBranchAddPage = ({
  loading,
  getBusinessAreaDetail,
  updateBusinessAreaFetch,
}: MasterBranchAddProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "businessArea" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isUpdate } = useGetPermissionMasterData("master-branch");
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/master-branch/edit/[id]");

  const handleUpdateBusinessArea = () => {
    if (form.isFieldsTouched()) {
      form
        .validateFields()
        .then(({ name, code }) => {
          try {
            updateBusinessAreaFetch({ id, name, code });
          } catch (err: any) {
            if (isApiResponse(err))
              sendErrorHandlerApi("handleUpdateBusinessArea", 40, err);
            else
              sendErrorHandler(
                "handleUpdateBusinessArea",
                40,
                err?.data?.message,
              );
          }
        })
        .catch((error) => {
          const messageHandler = MessageHandler();
          const errorHandler = messageHandler.error({ content: t("message") });

          if (isApiResponse(error))
            sendErrorHandlerApi(
              "handleUpdateBusinessArea",
              40,
              error,
              errorHandler,
            );
          else
            sendErrorHandler(
              "handleUpdateBusinessArea",
              40,
              "Validation form not pass",
              errorHandler,
            );
        });
    } else {
      Utils().onGoBack(router, "/master-data/master-branch");
    }
  };

  useEffect(() => {
    if (id) {
      try {
        getBusinessAreaDetail({ id });
      } catch (error: any) {
        if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 82, error);
        else sendErrorHandler("useEffect", 82, error?.data?.message);
      }
    }
    return () => form.resetFields();
  }, [id]);

  if (!isUpdate) return <Error404 />;

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          { title: t("breadcrumb.1"), url: ROUTE.MASTER_DATA.MASTER_BRANCH },
          { title: t("breadcrumb.2.edit") },
        ]}
        backUrl={ROUTE.MASTER_DATA.MASTER_BRANCH}
        isDirectToURL
      />
      <MasterBranch.Form
        form={form}
        loading={loading[businessAreaTypes.UPDATE_BUSINESS_AREA]}
        onSubmit={handleUpdateBusinessArea}
        type="update"
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  getBusinessAreaDetail: businessAreaActions.getBusinessAreaDetailFetch,
  updateBusinessAreaFetch: businessAreaActions.updateBusinessAreaFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MasterBranchAddPage);
