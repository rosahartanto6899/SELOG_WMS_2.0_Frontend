/* eslint-disable @typescript-eslint/no-explicit-any */
import Error404 from "@sera-components/error-boundary/Error404";
import PageHeader from "@sera-components/page-header";
import useGetPermissionMasterData from "@sera-components/pages/master-data/hooks/useGetPermission";
import MasterLocation from "@sera-components/pages/master-data/locations";
import MessageHandler from "@sera-libraries/message-handler";
import { locationActions, RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { locationTypes } from "@sera-types/location.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface MasterLocationAddProps {
  loading: LoadingState;
  createNewLocation: typeof locationActions.createNewLocationFetch;
}

const MasterLocationAddPage = ({
  loading,
  createNewLocation,
}: MasterLocationAddProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "location" });

  const [form] = Form.useForm();

  const { isCreate } = useGetPermissionMasterData("locations");
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/locations/add/index");

  const handleCreateLocation = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          // code: values?.code,
          name: values?.name,
          type: values?.type,
          address: values?.address,
          provinceId: values?.provinceId,
          cityId: values?.cityId,
          districtId: values?.districtId,
          coordinate: values?.coordinate,
        };

        try {
          createNewLocation(formData);
        } catch (error: any) {
          if (isApiResponse(error))
            sendErrorHandlerApi("handleCreateLocation", 26, error);
          else
            sendErrorHandler("handleCreateLocation", 26, error?.data?.message);
        }
      })
      .catch((error: any) => {
        const messageHandler = MessageHandler();

        if (isApiResponse(error))
          sendErrorHandlerApi(
            "handleCreateLocation",
            26,
            error,
            messageHandler.error,
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
          { title: t("breadcrumb.1"), url: ROUTE.MASTER_DATA.LOCATION },
          { title: t("breadcrumb.2.add") },
        ]}
        backUrl={ROUTE.MASTER_DATA.LOCATION}
        isDirectToURL
      />
      <MasterLocation.Form
        type="create"
        form={form}
        loading={loading[locationTypes.CREATE_LOCATION]}
        onSubmit={handleCreateLocation}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  createNewLocation: locationActions.createNewLocationFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MasterLocationAddPage);
