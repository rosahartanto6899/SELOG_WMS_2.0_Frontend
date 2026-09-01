/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermissionFleetManagement from "@sera-components/pages/fleet-management/hooks/useGetPermission";
import StockManagementComponent from "@sera-components/pages/fleet-management/stock-management";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState, unitActivityActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { unitActivityTypes } from "@sera-types/unit-activity";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface StockManagementVehiclePMCheckPageProps {
  loading: LoadingState;
  getPMCheckDetail: typeof unitActivityActions.getPMCheckDetailFetch;
  updatePMCheck: typeof unitActivityActions.updatePMCheckFetch;
}

const StockManagementVehiclePMCheckPage = ({
  loading,
  getPMCheckDetail,
  updatePMCheck,
}: StockManagementVehiclePMCheckPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "stockManagement" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isUpdate } = useGetPermissionFleetManagement("stock-management");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/stock-management/edit/km-check");

  const onHandleUpdateKMCheck = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          updatePMCheck({ vehicleId: id as string, KM: Number(_values?.KM) });
        } catch (_error: any) {
          sendErrorHandlerApi(
            "onHandleUpdateKMCheck",
            41,
            isApiResponse(_error) ? _error : _error?.data?.message,
          );
        }
      })
      .catch((_error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        sendErrorHandler(
          "onHandleUpdateKMCheck",
          41,
          isApiResponse(_error) ? _error : "Validation form not pass",
          errorHandler,
        );
      });
  };

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    try {
      getPMCheckDetail({ id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 68, error);
      else sendErrorHandler("useEffect", 68, error?.data?.message);
    }

    return () => form.resetFields();
  }, [id]);

  if (!isUpdate) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.kmCheck")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT,
        },
        { title: t("breadcrumb.2.kmCheck") },
      ]}
      backUrl={ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT}
      isDirectToURL
      withTab={false}
      content={
        <StockManagementComponent.FormKMCheck
          form={form}
          loading={
            loading[unitActivityTypes.GET_PM_CHECK_DETAIL] ||
            loading[unitActivityTypes.UPDATE_PM_CHECK]
          }
          onSubmit={onHandleUpdateKMCheck}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  getPMCheckDetail: unitActivityActions.getPMCheckDetailFetch,
  updatePMCheck: unitActivityActions.updatePMCheckFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockManagementVehiclePMCheckPage);
