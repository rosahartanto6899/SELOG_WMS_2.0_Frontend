/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import LocationForm from "@sera-components/pages/master-data/location/location-form";
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import { locationActions, RootState } from "@sera-redux";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const LocationAdd = ({
  loading,
  createLocation,
}: {
  loading: any;
  createLocation: typeof locationActions.createLocationFetch;
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, { keyPrefix: "masterData.location" });

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      createLocation(values);
    });
  };

  return (
    <LayoutUserManagement
      titlePage={t("form.title")}
      locationUrlList={[
        { title: t("breadcrumb.0") },
        { title: t("breadcrumb.1") },
      ]}
      backUrl="/master-data/location"
    >
      <LocationForm
        form={form}
        loading={!!loading.isLoading}
        onSubmit={handleSubmit}
      />
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});
const mapDispatchToProps = {
  createLocation: locationActions.createLocationFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationAdd);
