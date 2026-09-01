/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import MasterVehicleType from "@sera-components/pages/master-data/master-vehicle-type";
import { GetBreadcrumb } from "@sera-components/pages/master-data/master-vehicle-type/master-vehicle-type-props-header";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState } from "@sera-redux";
import { vehicleTypeActions } from "@sera-redux/slices/vehicle-type.slice";
import { LoadingState } from "@sera-types/loading.type";
import { vehicleTypeTypes } from "@sera-types/vehicle-type.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface MasterVehicleTypeEditProps {
  loading: LoadingState;
  vehicleTypes: any;
  getVehicleTypeDetail: typeof vehicleTypeActions.getVehicleTypeDetailFetch;
  updateVehicleType: typeof vehicleTypeActions.updateVehicleTypeFetch;
}

const MasterVehicleTypeEditPage = ({
  loading,
  vehicleTypes,
  getVehicleTypeDetail,
  updateVehicleType,
}: MasterVehicleTypeEditProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "vehicleType.edit" });
  const { isUpdate } = useCheckPermission({
    menuLink: "/master-data/vehicle-type",
  });
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/vehicle-type/edit/[id]");

  const handleUpdateVehicleType = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          id: id as string,
          name: values?.name,
          code: values?.code,
          group: values?.group,
        };

        updateVehicleType(formData);
      })
      .catch((error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        if (isApiResponse(error))
          sendErrorHandlerApi(
            "handleUpdateVehicleType",
            26,
            error,
            errorHandler,
          );
        else
          sendErrorHandler(
            "handleUpdateVehicleType",
            26,
            "Validation form not pass",
            errorHandler,
          );
      });
  };

  useEffect(() => {
    if (id) {
      getVehicleTypeDetail({ id: id as string });
    }
  }, [id, getVehicleTypeDetail]);

  useEffect(() => {
    if (vehicleTypes.vehicleTypeDetail.data.name) {
      form.setFieldsValue({
        name: vehicleTypes.vehicleTypeDetail.data.name,
      });
    }
  }, [form, vehicleTypes]);

  if (!isUpdate) return <Error404 />;

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[...GetBreadcrumb(), { title: t("title") }]}
        backUrl={ROUTE.MASTER_DATA.VEHICLE_TYPE}
        isDirectToURL
      />
      <MasterVehicleType.Form
        type="update"
        form={form}
        loading={loading[vehicleTypeTypes.UPDATE_VEHICLE_TYPE]}
        onSubmit={handleUpdateVehicleType}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  vehicleTypes: state.vehicleTypes,
});

const mapDispatchToProps = {
  getVehicleTypeDetail: vehicleTypeActions.getVehicleTypeDetailFetch,
  updateVehicleType: vehicleTypeActions.updateVehicleTypeFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MasterVehicleTypeEditPage);
