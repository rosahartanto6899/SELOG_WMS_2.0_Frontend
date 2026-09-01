/* eslint-disable react-hooks/exhaustive-deps */
import PageLayout from "@sera-components/layout/page-layout";
import CustomerTable from "@sera-components/pages/user-management/customers/customer-table";
import { RootState, wmsCustomerActions } from "@sera-redux";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const CustomersPage = ({ customers, loading, getCustomers }: any) => {
  const { t } = useTranslation(undefined, { keyPrefix: "customerManagement" });

  return (
    <PageLayout
      title={t("title")}
      breadcrumb={[
        { title: t("breadcrumb.0.title") },
        { title: t("breadcrumb.1.title") },
      ]}
      content={
        <CustomerTable
          dataSource={customers.data}
          options={customers.options}
          loading={loading[wmsCustomerActions.getCustomersFetch.type]}
          onFetch={getCustomers}
          onDelete={wmsCustomerActions.deleteCustomerFetch}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  customers: state.wmsCustomers,
  loading: state.loading,
});
const mapDispatchToProps = {
  getCustomers: wmsCustomerActions.getCustomersFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomersPage);
