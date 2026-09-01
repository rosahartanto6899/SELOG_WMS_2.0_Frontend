/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageLayout from "@sera-components/layout/page-layout";
import useGetPermissionFleetManagement from "@sera-components/pages/fleet-management/hooks/useGetPermission";
import UnitActivitiesComponent from "@sera-components/pages/fleet-management/unit-activities";
import { CONST_VEHICLE_STATUS } from "@sera-components/pages/fleet-management/unit-activities/unit-activities-form";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState, unitActivityActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import {
  MaintenancePayloadDetail,
  unitActivityTypes,
} from "@sera-types/unit-activity";
import { DATE_FORMAT } from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { cloneDeep } from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface UnitMaintenaceEditPageProps {
  loading: LoadingState;
  getUnitDetail: typeof unitActivityActions.getUnitDetailFetch;
  updateMaintenance: typeof unitActivityActions.updateMaintenanceFetch;
}

const UnitMaintenaceEditPage = ({
  loading,
  getUnitDetail,
  updateMaintenance,
}: UnitMaintenaceEditPageProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "unitActivities" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isUpdate } = useGetPermissionFleetManagement("unit-activities");

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/unit-activity/edit");

  const onHandleUpdateMaintenance = () => {
    form
      .validateFields()
      .then((_values) => {
        try {
          const _payload = cloneDeep(_values);
          const _format = "YYYY-MM-DD HH:mm:ss";

          delete _payload?.vehicleId;
          delete _payload?.unitType;
          delete _payload?.lastLocation;

          if (_values?.actualStartDate) {
            _payload.actualStartDate = DATE_FORMAT(
              _values?.actualStartDate,
              _format,
            );
          }

          if (_values?.actualEndDate) {
            _payload.actualEndDate = DATE_FORMAT(
              _values?.actualEndDate,
              _format,
            );
          }

          updateMaintenance({
            id,
            ..._payload,
            status:
              typeof _values?.status === "boolean"
                ? CONST_VEHICLE_STATUS[_values?.status ? 0 : 1]
                : undefined,
            bookingStartDate: DATE_FORMAT(_values?.bookingStartDate, _format),
            bookingEndDate: DATE_FORMAT(_values?.bookingEndDate, _format),
            maintenanceDetail: _values?.maintenanceDetail
              ?.filter(
                (_item: MaintenancePayloadDetail) =>
                  _item?.activityDateTime && _item?.activityDetail,
              )
              ?.map((_item: MaintenancePayloadDetail) => ({
                ..._item,
                activityDateTime: DATE_FORMAT(_item?.activityDateTime, _format),
              })),
          });
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
      getUnitDetail({ id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 69, error);
      else sendErrorHandler("useEffect", 69, error?.data?.message);
    }

    return () => form.resetFields();
  }, [id]);

  if (!isUpdate) return <Error404 />;

  return (
    <PageLayout
      title={t("breadcrumb.2.edit")}
      breadcrumb={[
        { title: t("breadcrumb.0") },
        {
          title: t("breadcrumb.1"),
          url: ROUTE.FLEET_MANAGEMENT.UNIT_ACTIVITIES,
        },
        { title: t("breadcrumb.2.edit") },
      ]}
      backUrl={ROUTE.FLEET_MANAGEMENT.UNIT_ACTIVITIES}
      isDirectToURL
      withTab={false}
      content={
        <UnitActivitiesComponent.Form
          type="update"
          form={form}
          loading={
            loading[unitActivityTypes.GET_UNIT_DETAIL] ||
            loading[unitActivityTypes.UPDATE_MAINTENANCE]
          }
          onSubmit={onHandleUpdateMaintenance}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  getUnitDetail: unitActivityActions.getUnitDetailFetch,
  updateMaintenance: unitActivityActions.updateMaintenanceFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitMaintenaceEditPage);
