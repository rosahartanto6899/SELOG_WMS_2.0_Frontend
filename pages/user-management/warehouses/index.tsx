/* eslint-disable react-hooks/exhaustive-deps */
import PageLayout from "@sera-components/layout/page-layout";
import WarehouseTable from "@sera-components/pages/user-management/warehouses/warehouse-table";
import { RootState, wmsWarehouseActions } from "@sera-redux";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const WarehousesPage = ({ warehouses, loading, getWarehouses }: any) => {
  const { t } = useTranslation(undefined, { keyPrefix: "warehouseManagement" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[
        { title: t("breadcrumb.0.title") },
        { title: t("breadcrumb.1.title") },
      ]}
      content={
        <WarehouseTable
          dataSource={warehouses.data}
          options={warehouses.options}
          loading={loading[wmsWarehouseActions.getWarehousesFetch.type]}
          onFetch={getWarehouses}
          onDelete={wmsWarehouseActions.deleteWarehouseFetch}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  warehouses: state.wmsWarehouses,
  loading: state.loading,
});
const mapDispatchToProps = {
  getWarehouses: wmsWarehouseActions.getWarehousesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(WarehousesPage);
