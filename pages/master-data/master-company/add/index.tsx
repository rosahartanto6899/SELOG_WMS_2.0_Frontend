/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import CompanyComponent from "@sera-components/pages/master-data/master-company";
import MessageHandler from "@sera-libraries/message-handler";
import { companyActions, RootState } from "@sera-redux";
import { companyTypes } from "@sera-types/company.type";
import { LoadingState } from "@sera-types/loading.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface MasterCompanyAddProps {
  loading: LoadingState;
  createNewCompany: typeof companyActions.createNewCompanyFetch;
}

const MasterCompanyAddPage = ({
  loading,
  createNewCompany,
}: MasterCompanyAddProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "company.add" });
  const { isCreate } = useCheckPermission({
    menuLink: ROUTE.MASTER_DATA.MASTER_COMPANY,
  });
  const [form] = Form.useForm();

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/master-company/add/index");

  const handleCreateCompany = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          name: values?.name,
          code: values?.code,
        };

        try {
          createNewCompany(formData);
        } catch (error: any) {
          if (isApiResponse(error))
            sendErrorHandlerApi("handleCreateCompany", 26, error);
          else
            sendErrorHandler("handleCreateCompany", 26, error?.data?.message);
        }
      })
      .catch((error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        if (isApiResponse(error))
          sendErrorHandlerApi("handleCreateCompany", 26, error, errorHandler);
        else
          sendErrorHandler(
            "handleCreateCompany",
            26,
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
          { title: t("breadcrumb.1"), url: ROUTE.MASTER_DATA.MASTER_COMPANY },
          { title: t("breadcrumb.2") },
        ]}
        backUrl={ROUTE.MASTER_DATA.MASTER_COMPANY}
        isDirectToURL
      />
      <CompanyComponent.Form
        type="create"
        form={form}
        loading={loading[companyTypes.CREATE_COMPANY]}
        onSubmit={handleCreateCompany}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  createNewCompany: companyActions.createNewCompanyFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MasterCompanyAddPage);
