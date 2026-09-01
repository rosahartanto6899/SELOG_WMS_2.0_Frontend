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
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface MasterVehicleTypeAddProps {
  loading: LoadingState;
  createNewVehicleType: typeof vehicleTypeActions.createNewVehicleTypeFetch;
}

const MasterVehicleTypeAddPage = ({
  loading,
  createNewVehicleType,
}: MasterVehicleTypeAddProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "vehicleType.add" });
  const { isCreate } = useCheckPermission({
    menuLink: "/master-data/vehicle-type",
  });
  const [form] = Form.useForm();

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/vehicle-type/add/index");

  const handleCreateVehicleType = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          name: values?.name,
          code: values?.code,
          group: values?.group,
        };

        createNewVehicleType(formData);
      })
      .catch((error: any) => {
        const messageHandler = MessageHandler();
        const errorHandler = messageHandler.error({ content: t("message") });

        if (isApiResponse(error))
          sendErrorHandlerApi(
            "handleCreateVehicleType",
            26,
            error,
            errorHandler,
          );
        else
          sendErrorHandler(
            "handleCreateVehicleType",
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
        breadcrumb={[...GetBreadcrumb(), { title: t("title") }]}
        backUrl={ROUTE.MASTER_DATA.VEHICLE_TYPE}
        isDirectToURL
      />
      <MasterVehicleType.Form
        type="create"
        form={form}
        loading={loading[vehicleTypeTypes.CREATE_VEHICLE_TYPE]}
        onSubmit={handleCreateVehicleType}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  vehicleTypes: state.vehicleTypes,
});

const mapDispatchToProps = {
  createNewVehicleType: vehicleTypeActions.createNewVehicleTypeFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MasterVehicleTypeAddPage);
