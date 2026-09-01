/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
import Utils from "@sera-utils/utils";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface MasterCompanyEditProps {
  loading: LoadingState;
  getCompanyDetail: typeof companyActions.getCompanyDetailFetch;
  updateCompanyFetch: typeof companyActions.updateCompanyFetch;
}
const MasterCompanyEditPage = ({
  loading,
  getCompanyDetail,
  updateCompanyFetch,
}: MasterCompanyEditProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "company.edit" });
  const { isRead } = useCheckPermission({
    menuLink: ROUTE.MASTER_DATA.MASTER_COMPANY,
  });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/master-company/edit/[id]");

  const handleUpdateCompany = () => {
    if (form.isFieldsTouched()) {
      form
        .validateFields()
        .then((values) => {
          const formData = {
            id,
            code: values?.code,
            name: values?.name,
          };

          try {
            updateCompanyFetch(formData);
          } catch (err: any) {
            if (isApiResponse(err))
              sendErrorHandlerApi("handleUpdateCompany", 31, err);
            else
              sendErrorHandler("handleUpdateCompany", 31, err?.data?.message);
          }
        })
        .catch((error) => {
          const messageHandler = MessageHandler();
          const errorHandler = messageHandler.error({ content: t("message") });

          if (isApiResponse(error))
            sendErrorHandlerApi("handleUpdateCompany", 31, error, errorHandler);
          else
            sendErrorHandler(
              "handleUpdateCompany",
              31,
              "Validation form not pass",
              errorHandler,
            );
        });
    } else {
      Utils().onGoBack(router, "/master-data/master-company");
    }
  };

  useEffect(() => {
    if (id) {
      try {
        getCompanyDetail({ id });
      } catch (error: any) {
        if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 62, error);
        else sendErrorHandler("useEffect", 62, error?.data?.message);
      }
    }
    return () => form.resetFields();
  }, [id]);

  if (!isRead) return <Error404 />;

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
        type="update"
        form={form}
        loading={loading[companyTypes.UPDATE_COMPANY]}
        onSubmit={handleUpdateCompany}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  getCompanyDetail: companyActions.getCompanyDetailFetch,
  updateCompanyFetch: companyActions.updateCompanyFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MasterCompanyEditPage);
