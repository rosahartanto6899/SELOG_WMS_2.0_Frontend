/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import MaterialForm from "@sera-components/pages/master-data/material/material-form";
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import { materialActions, RootState } from "@sera-redux";
import { MaterialState } from "@sera-types/material.type";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const MaterialEdit = ({
  loading,
  updateMaterial,
  getMaterialDetail,
  materials,
}: {
  loading: any;
  updateMaterial: typeof materialActions.updateMaterialFetch;
  getMaterialDetail: typeof materialActions.getMaterialDetailFetch;
  materials: MaterialState;
}) => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, { keyPrefix: "masterData.material" });

  useEffect(() => {
    if (id) getMaterialDetail({ id: id as string });
  }, [id]);

  useEffect(() => {
    const d = materials.materialDetail.data;
    if (d?.id) {
      form.setFieldsValue({
        code: d.code,
        name: d.name,
        category: d.category,
        barcode: d.barcode,
        brand: d.brand,
        uoM: d.uoM,
        description: d.description,
      });
    }
  }, [materials.materialDetail.data]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      updateMaterial({ id: id as string, items: values });
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
        type="update"
        loading={!!loading.isLoading}
        onSubmit={handleSubmit}
      />
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  materials: state.materials,
  loading: state.loading,
});
const mapDispatchToProps = {
  updateMaterial: materialActions.updateMaterialFetch,
  getMaterialDetail: materialActions.getMaterialDetailFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(MaterialEdit);
