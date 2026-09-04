/* eslint-disable react-hooks/exhaustive-deps */
import PageLayout from "@sera-components/layout/page-layout";
import MaterialTable from "@sera-components/pages/master-data/material/material-table";
import { materialActions, RootState } from "@sera-redux";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const MaterialPage = ({ materials, loading, getMaterials }: any) => {
  const { t } = useTranslation(undefined, { keyPrefix: "masterData.material" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={
        <MaterialTable
          dataSource={materials.data}
          options={materials.options}
          loading={loading[materialActions.getMaterialsFetch.type]}
          onFetch={getMaterials}
          onDelete={materialActions.deleteMaterialFetch}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  materials: state.materials,
  loading: state.loading,
});
const mapDispatchToProps = {
  getMaterials: materialActions.getMaterialsFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(MaterialPage);
