/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface MasterBranchAddProps {
  loading: LoadingState;
  createNewBusinessArea: typeof businessAreaActions.createNewBusinessAreaFetch;
}

const MasterBranchAddPage = ({
  loading,
  createNewBusinessArea,
}: MasterBranchAddProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "businessArea" });

  const [form] = Form.useForm();

  const { isCreate } = useGetPermissionMasterData("master-branch");
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/master-branch/add/index");

  const handleCreateBusinessArea = () => {
    form
      .validateFields()
      .then(({ name, code }) => {
        try {
          createNewBusinessArea({ name, code });
        } catch (error: any) {
          if (isApiResponse(error))
            sendErrorHandlerApi("handleCreateBusinessArea", 33, error);
          else
            sendErrorHandler(
              "handleCreateBusinessArea",
              33,
              error?.data?.message,
            );
        }
      })
      .catch((error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        if (isApiResponse(error))
          sendErrorHandlerApi(
            "handleCreateBusinessArea",
            33,
            error,
            errorHandler,
          );
        else
          sendErrorHandler(
            "handleCreateBusinessArea",
            33,
            "Validation form not pass",
            errorHandler,
          );
      });
  };

  if (!isCreate) return <Error404 />;

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          { title: t("breadcrumb.1"), url: ROUTE.MASTER_DATA.MASTER_BRANCH },
          { title: t("breadcrumb.2.add") },
        ]}
        backUrl={ROUTE.MASTER_DATA.MASTER_BRANCH}
        isDirectToURL
      />
      <MasterBranch.Form
        type="create"
        form={form}
        loading={loading[businessAreaTypes.CREATE_BUSINESS_AREA]}
        onSubmit={handleCreateBusinessArea}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  createNewBusinessArea: businessAreaActions.createNewBusinessAreaFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MasterBranchAddPage);
