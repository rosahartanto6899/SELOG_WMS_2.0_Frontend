/* eslint-disable react-hooks/exhaustive-deps */
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
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface StockManagementVehicleEditPageProps {
  loading: LoadingState;
  detailVehicle: typeof stockManagementActions.detailVehicleFetch;
  updateVehicle: typeof stockManagementActions.updateVehicleFetch;
}

const StockManagementVehicleEditPage = ({
  loading,
  detailVehicle,
  updateVehicle,
}: StockManagementVehicleEditPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "stockManagement" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isUpdate } = useGetPermissionFleetManagement("stock-management");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/stock-management/edit");

  const onHandleUpdateStock = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          updateVehicle(FORMAT_PAYLOAD({ ..._values, id }));
        } catch (_error: any) {
          sendErrorHandlerApi(
            "onHandleUpdateStock",
            34,
            isApiResponse(_error) ? _error : _error?.data?.message,
          );
        }
      })
      .catch((_error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        sendErrorHandler(
          "onHandleUpdateStock",
          34,
          isApiResponse(_error) ? _error : "Validation form not pass",
          errorHandler,
        );
      });
  };

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    try {
      detailVehicle({ id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 69, error);
      else sendErrorHandler("useEffect", 69, error?.data?.message);
    }

    return () => form.resetFields();
  }, [id]);

  if (!isUpdate) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.update")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT,
        },
        { title: t("breadcrumb.2.update") },
      ]}
      backUrl={ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT}
      isDirectToURL
      withTab={false}
      content={
        <StockManagementComponent.Form
          type="update"
          form={form}
          loading={
            loading[stockManagementTypes.DETAIL_VEHICLE] ||
            loading[stockManagementTypes.UPDATE_VEHICLE]
          }
          onSubmit={onHandleUpdateStock}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  detailVehicle: stockManagementActions.detailVehicleFetch,
  updateVehicle: stockManagementActions.updateVehicleFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockManagementVehicleEditPage);
