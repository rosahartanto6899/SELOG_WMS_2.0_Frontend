/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermissionFleetManagement from "@sera-components/pages/fleet-management/hooks/useGetPermission";
import UnitActivitiesComponent from "@sera-components/pages/fleet-management/unit-activities";
import { CONST_VEHICLE_STATUS } from "@sera-components/pages/fleet-management/unit-activities/unit-activities-form";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState, unitActivityActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { unitActivityTypes } from "@sera-types/unit-activity";
import { DATE_FORMAT } from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { cloneDeep } from "lodash";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface UnitMaintenanceAddPageProps {
  loading: LoadingState;
  createMaintenance: typeof unitActivityActions.createMaintenanceFetch;
}

const UnitMaintenanceAddPage = ({
  loading,
  createMaintenance,
}: UnitMaintenanceAddPageProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "unitActivities" });

  const [form] = Form.useForm();

  const { isCreate } = useGetPermissionFleetManagement("unit-activities");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/unit-activity/add");

  const onHandleCreateMaintenance = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          const _payload = cloneDeep(_values);
          const _format = "YYYY-MM-DD HH:mm:ss";

          delete _payload?.unitType;
          delete _payload?.lastLocation;

          createMaintenance({
            ..._payload,
            status:
              typeof _values?.status === "boolean"
                ? CONST_VEHICLE_STATUS[_values?.status ? 0 : 1]
                : undefined,
            bookingStartDate: DATE_FORMAT(_values?.bookingStartDate, _format),
            bookingEndDate: DATE_FORMAT(_values?.bookingEndDate, _format),
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
          url: ROUTE.FLEET_MANAGEMENT.UNIT_ACTIVITIES,
        },
        { title: t("breadcrumb.2.add") },
      ]}
      backUrl={ROUTE.FLEET_MANAGEMENT.UNIT_ACTIVITIES}
      isDirectToURL
      withTab={false}
      content={
        <UnitActivitiesComponent.Form
          type="create"
          form={form}
          loading={loading[unitActivityTypes.CREATE_MAINTENANCE]}
          onSubmit={onHandleCreateMaintenance}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  createMaintenance: unitActivityActions.createMaintenanceFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitMaintenanceAddPage);
