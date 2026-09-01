/* eslint-disable react-hooks/exhaustive-deps */
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import { RootState, wmsWarehouseActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { WmsWarehouseState } from "@sera-types/wms-customer.type";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import WarehouseForm from "../../../../components/pages/user-management/warehouses/warehouse-form";

const WarehouseEdit = ({
  loading,
  updateWarehouse,
  getWarehouseDetail,
  warehouses,
}: {
  loading: LoadingState;
  updateWarehouse: typeof wmsWarehouseActions.updateWarehouseFetch;
  getWarehouseDetail: typeof wmsWarehouseActions.getWarehouseDetailFetch;
  warehouses: WmsWarehouseState;
}) => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, { keyPrefix: "warehouseManagement" });

  const LOCATION_BREADCRUMBS = [
    { title: t("breadcrumb.0.title") },
    { title: t("breadcrumb.1.title") },
  ];

  useEffect(() => {
    if (id) getWarehouseDetail({ id: id as string });
  }, [id]);

  useEffect(() => {
    const d = warehouses.warehouseDetail.data;
    if (d?.id) {
      form.setFieldsValue({
        customerId: d.customerId,
        code: d.code,
        name: d.name,
        address: d.address,
        phone: d.phone,
      });
    }
  }, [warehouses.warehouseDetail.data]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      updateWarehouse({ id: id as string, items: values });
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
  updateWarehouse: wmsWarehouseActions.updateWarehouseFetch,
  getWarehouseDetail: wmsWarehouseActions.getWarehouseDetailFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseEdit);
