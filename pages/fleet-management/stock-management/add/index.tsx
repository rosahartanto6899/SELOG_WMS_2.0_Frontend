/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermissionFleetManagement from "@sera-components/pages/fleet-management/hooks/useGetPermission";
import StockManagementComponent from "@sera-components/pages/fleet-management/stock-management";
import { FORMAT_PAYLOAD } from "@sera-components/pages/fleet-management/stock-management/stock-management-form";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState, stockManagementActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { stockManagementTypes } from "@sera-types/stock-management.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface StockManagementVehicleAddPageProps {
  loading: LoadingState;
  createVehicle: typeof stockManagementActions.createVehicleFetch;
}

const StockManagementVehicleAddPage = ({
  loading,
  createVehicle,
}: StockManagementVehicleAddPageProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "stockManagement" });

  const [form] = Form.useForm();

  const { isCreate } = useGetPermissionFleetManagement("stock-management");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/stock-management/add");

  const onHandleCreateStock = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          createVehicle(FORMAT_PAYLOAD(_values));
        } catch (_error: any) {
          sendErrorHandlerApi(
            "onHandleCreateStock",
            34,
            isApiResponse(_error) ? _error : _error?.data?.message,
          );
        }
      })
      .catch((_error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        sendErrorHandler(
          "onHandleCreateStock",
          35,
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
          url: ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT,
        },
        { title: t("breadcrumb.2.add") },
      ]}
      backUrl={ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT}
      isDirectToURL
      withTab={false}
      content={
        <StockManagementComponent.Form
          type="create"
          form={form}
          loading={loading[stockManagementTypes.CREATE_VEHICLE]}
          onSubmit={onHandleCreateStock}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  createVehicle: stockManagementActions.createVehicleFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockManagementVehicleAddPage);
