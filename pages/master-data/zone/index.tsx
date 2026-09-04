/* eslint-disable react-hooks/exhaustive-deps */
import PageLayout from "@sera-components/layout/page-layout";
import ZoneTable from "@sera-components/pages/master-data/zone/zone-table";
import { RootState, zoneActions } from "@sera-redux";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const ZonePage = ({ zones, loading, getZones }: any) => {
  const { t } = useTranslation(undefined, { keyPrefix: "masterData.zone" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={
        <ZoneTable
          dataSource={zones.data}
          options={zones.options}
          loading={loading[zoneActions.getZonesFetch.type]}
          onFetch={getZones}
          onDelete={zoneActions.deleteZoneFetch}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  zones: state.zones,
  loading: state.loading,
});
const mapDispatchToProps = {
  getZones: zoneActions.getZonesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ZonePage);
