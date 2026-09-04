/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ZoneForm from "@sera-components/pages/master-data/zone/zone-form";
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import { RootState, zoneActions } from "@sera-redux";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const ZoneAdd = ({
  loading,
  createZone,
}: {
  loading: any;
  createZone: typeof zoneActions.createZoneFetch;
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, { keyPrefix: "masterData.zone" });

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      createZone(values);
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
  createZone: zoneActions.createZoneFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ZoneAdd);
