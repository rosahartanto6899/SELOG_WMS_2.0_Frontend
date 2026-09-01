/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import { RootState, wmsCustomerActions } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { WmsCustomerState } from "@sera-types/wms-customer.type";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import CustomerForm from "../../../../components/pages/user-management/customers/customer-form";

const CustomerEdit = ({
  loading,
  updateCustomer,
  getCustomerDetail,
  customers,
}: {
  loading: LoadingState;
  updateCustomer: typeof wmsCustomerActions.updateCustomerFetch;
  getCustomerDetail: typeof wmsCustomerActions.getCustomerDetailFetch;
  customers: WmsCustomerState;
}) => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const { t } = useTranslation(undefined, { keyPrefix: "customerManagement" });

  const LOCATION_BREADCRUMBS = [
    { title: t("breadcrumb.0.title") },
    { title: t("breadcrumb.1.title") },
  ];

  useEffect(() => {
    if (id) getCustomerDetail({ id: id as string });
  }, [id]);

  useEffect(() => {
    const d = customers.customerDetail.data;
    if (d?.id) {
      form.setFieldsValue({
        code: d.code,
        name: d.name,
        address: d.address,
        phone: d.phone,
      });
    }
  }, [customers.customerDetail.data]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      updateCustomer({ id: id as string, items: values });
    });
  };

  return (
    <LayoutUserManagement
      titlePage={t("form.title")}
      locationUrlList={LOCATION_BREADCRUMBS}
    >
      <CustomerForm
        form={form}
        loading={!!loading.isLoading}
        onSubmit={handleSubmit}
      />
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  customers: state.wmsCustomers,
  loading: state.loading,
});
const mapDispatchToProps = {
  updateCustomer: wmsCustomerActions.updateCustomerFetch,
  getCustomerDetail: wmsCustomerActions.getCustomerDetailFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerEdit);
