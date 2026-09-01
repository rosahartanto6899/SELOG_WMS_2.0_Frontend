/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
import Utils from "@sera-utils/utils";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface MasterLocationEditProps {
  loading: LoadingState;
  getLocationDetail: typeof locationActions.getLocationDetailFetch;
  updateLocationFetch: typeof locationActions.updateLocationFetch;
}
const MasterLocationEditPage = ({
  loading,
  getLocationDetail,
  updateLocationFetch,
}: MasterLocationEditProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, { keyPrefix: "location" });

  const [form] = Form.useForm();
  const { id } = router.query;

  const { isUpdate } = useGetPermissionMasterData("locations");
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/master-data/locations/edit/[id]");

  const handleUpdateLocation = () => {
    if (form.isFieldsTouched()) {
      form
        .validateFields()
        .then((values) => {
          const formData = {
            id,
            name: values?.name,
            type: values?.type,
            address: values?.address,
            provinceId: values?.provinceId,
            cityId: values?.cityId,
            districtId: values?.districtId,
            coordinate: values?.coordinate,
          };

          try {
            updateLocationFetch(formData);
          } catch (err: any) {
            if (isApiResponse(err))
              sendErrorHandlerApi("handleUpdateLocation", 57, err);
            else
              sendErrorHandler("handleUpdateLocation", 59, err?.data?.message);
          }
        })
        .catch((error) => {
          const messageHandler = MessageHandler();

          if (isApiResponse(error))
            sendErrorHandlerApi(
              "handleUpdateLocation",
              31,
              error,
              messageHandler.error,
            );
        });
    } else {
      Utils().onGoBack(router, "/master-data/locations");
    }
  };

  useEffect(() => {
    if (id) {
      try {
        getLocationDetail({ id });
      } catch (error: any) {
        if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 91, error);
        else sendErrorHandler("useEffect", 92, error?.data?.message);
      }
    }
    return () => form.resetFields();
  }, [id]);

  if (!isUpdate) return <Error404 />;

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          { title: t("breadcrumb.1"), url: ROUTE.MASTER_DATA.LOCATION },
          { title: t("breadcrumb.2.edit") },
        ]}
        backUrl={ROUTE.MASTER_DATA.LOCATION}
        isDirectToURL
      />
      <MasterLocation.Form
        form={form}
        loading={loading[locationTypes.UPDATE_LOCATION]}
        onSubmit={handleUpdateLocation}
        type="update"
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  getLocationDetail: locationActions.getLocationDetailFetch,
  updateLocationFetch: locationActions.updateLocationFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MasterLocationEditPage);
