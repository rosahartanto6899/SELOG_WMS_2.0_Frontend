/* eslint-disable react-hooks/exhaustive-deps */
import PageLayout from "@sera-components/layout/page-layout";
import MaterialMappingTable from "@sera-components/pages/master-data/material-mapping/material-mapping-table";
import MaterialMappingUpsertBulk from "@sera-components/pages/master-data/material-mapping/material-mapping-upsert-bulk";
import { materialLocationMappingActions, RootState } from "@sera-redux";
import { Space } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const MaterialMappingPage = ({ mappings, loading, getMappings }: any) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "masterData.materialMapping",
  });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          <MaterialMappingUpsertBulk />
          <MaterialMappingTable
            dataSource={mappings.data}
            options={mappings.options}
            loading={
              loading[materialLocationMappingActions.getMappingsFetch.type]
            }
            onFetch={getMappings}
          />
        </Space>
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  mappings: state.materialLocationMapping,
  loading: state.loading,
});
const mapDispatchToProps = {
  getMappings: materialLocationMappingActions.getMappingsFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MaterialMappingPage);
