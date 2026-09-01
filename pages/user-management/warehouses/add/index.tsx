/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import { RootState, wmsWarehouseActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import WarehouseForm from "../../../../components/pages/user-management/warehouses/warehouse-form";

const WarehouseAdd = ({
  loading,
  createWarehouse,
}: {
  loading: LoadingState;
  createWarehouse: typeof wmsWarehouseActions.createWarehouseFetch;
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, { keyPrefix: "warehouseManagement" });

  const LOCATION_BREADCRUMBS = [
    { title: t("breadcrumb.0.title") },
    { title: t("breadcrumb.1.title") },
  ];

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      createWarehouse(values);
    });
  };

  return (
    <LayoutUserManagement
      titlePage={t("form.title")}
      locationUrlList={LOCATION_BREADCRUMBS}
    >
      <WarehouseForm
        form={form}
        loading={!!loading.isLoading}
        onSubmit={handleSubmit}
      />
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  warehouses: state.wmsWarehouses,
  loading: state.loading,
});
const mapDispatchToProps = {
  createWarehouse: wmsWarehouseActions.createWarehouseFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseAdd);
