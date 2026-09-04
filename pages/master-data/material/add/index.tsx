/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import MaterialForm from "@sera-components/pages/master-data/material/material-form";
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import { materialActions, RootState } from "@sera-redux";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const MaterialAdd = ({
  loading,
  createMaterial,
}: {
  loading: any;
  createMaterial: typeof materialActions.createMaterialFetch;
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, { keyPrefix: "masterData.material" });

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      createMaterial(values);
    });
  };

  return (
    <LayoutUserManagement
      titlePage={t("form.title")}
      locationUrlList={[
        { title: t("breadcrumb.0") },
        { title: t("breadcrumb.1") },
      ]}
      backUrl="/master-data/material"
    >
      <MaterialForm
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
  createMaterial: materialActions.createMaterialFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(MaterialAdd);
