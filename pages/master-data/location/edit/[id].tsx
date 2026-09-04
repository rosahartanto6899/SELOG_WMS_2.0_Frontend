/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import LocationForm from "@sera-components/pages/master-data/location/location-form";
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import { locationActions, RootState } from "@sera-redux";
import { LocationState } from "@sera-types/location.type";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const LocationEdit = ({
  loading,
  updateLocation,
  getLocationDetail,
  locations,
}: {
  loading: any;
  updateLocation: typeof locationActions.updateLocationFetch;
  getLocationDetail: typeof locationActions.getLocationDetailFetch;
  locations: LocationState;
}) => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, { keyPrefix: "masterData.location" });

  useEffect(() => {
    if (id) getLocationDetail({ id: id as string });
  }, [id]);

  useEffect(() => {
    const d = locations.locationDetail.data;
    if (d?.id) {
      form.setFieldsValue({
        warehouseCode: d.warehouseCode,
        warehouseName: d.warehouseName,
        code: d.code,
        name: d.name,
        barcode: d.barcode,
        zoneId: d.zoneId,
        category: d.category,
        description: d.description,
      });
    }
  }, [locations.locationDetail.data]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      updateLocation({ id: id as string, items: values });
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
        type="update"
        warehouseCode={locations.locationDetail.data?.warehouseCode ?? null}
        loading={!!loading.isLoading}
        onSubmit={handleSubmit}
      />
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  locations: state.locations,
  loading: state.loading,
});
const mapDispatchToProps = {
  updateLocation: locationActions.updateLocationFetch,
  getLocationDetail: locationActions.getLocationDetailFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationEdit);
