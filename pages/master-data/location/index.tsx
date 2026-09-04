/* eslint-disable react-hooks/exhaustive-deps */
import PageLayout from "@sera-components/layout/page-layout";
import LocationTable from "@sera-components/pages/master-data/location/location-table";
import { locationActions, RootState } from "@sera-redux";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const LocationPage = ({ locations, loading, getLocations }: any) => {
  const { t } = useTranslation(undefined, { keyPrefix: "masterData.location" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[{ title: t("breadcrumb.0") }, { title: t("breadcrumb.1") }]}
      content={
        <LocationTable
          dataSource={locations.data}
          options={locations.options}
          loading={loading[locationActions.getLocationsFetch.type]}
          onFetch={getLocations}
          onDelete={locationActions.deleteLocationFetch}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  locations: state.locations,
  loading: state.loading,
});
const mapDispatchToProps = {
  getLocations: locationActions.getLocationsFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationPage);
