/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ZoneForm from "@sera-components/pages/master-data/zone/zone-form";
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import { RootState, zoneActions } from "@sera-redux";
import { ZoneState } from "@sera-types/zone.type";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const ZoneEdit = ({
  loading,
  updateZone,
  getZoneDetail,
  zones,
}: {
  loading: any;
  updateZone: typeof zoneActions.updateZoneFetch;
  getZoneDetail: typeof zoneActions.getZoneDetailFetch;
  zones: ZoneState;
}) => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, { keyPrefix: "masterData.zone" });

  useEffect(() => {
    if (id) getZoneDetail({ id: id as string });
  }, [id]);

  useEffect(() => {
    const d = zones.zoneDetail.data;
    if (d?.id) {
      form.setFieldsValue({
        warehouseCode: d.warehouseCode,
        warehouseName: d.warehouseName,
        code: d.code,
        name: d.name,
        description: d.description,
      });
    }
  }, [zones.zoneDetail.data]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      updateZone({ id: id as string, items: values });
    });
  };

  return (
    <LayoutUserManagement
      titlePage={t("form.title")}
      locationUrlList={[
        { title: t("breadcrumb.0") },
        { title: t("breadcrumb.1") },
      ]}
      backUrl="/master-data/zone"
    >
      <ZoneForm
        form={form}
        type="update"
        loading={!!loading.isLoading}
        onSubmit={handleSubmit}
      />
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  zones: state.zones,
  loading: state.loading,
});
const mapDispatchToProps = {
  updateZone: zoneActions.updateZoneFetch,
  getZoneDetail: zoneActions.getZoneDetailFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ZoneEdit);
