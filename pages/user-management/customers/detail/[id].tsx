/* eslint-disable react-hooks/exhaustive-deps */
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import { RootState, wmsCustomerActions } from "@sera-redux";
import { WmsCustomerState } from "@sera-types/wms-customer.type";
import { Descriptions } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const CustomerDetail = ({
  customers,
  getCustomerDetail,
}: {
  customers: WmsCustomerState;
  getCustomerDetail: typeof wmsCustomerActions.getCustomerDetailFetch;
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(undefined, { keyPrefix: "customerManagement" });

  const LOCATION_BREADCRUMBS = [
    { title: t("breadcrumb.0.title") },
    { title: t("breadcrumb.1.title") },
  ];

  useEffect(() => {
    if (id) getCustomerDetail({ id: id as string });
  }, [id]);

  const d = customers.customerDetail.data;

  return (
    <LayoutUserManagement
      titlePage={t("title")}
      locationUrlList={LOCATION_BREADCRUMBS}
    >
      <Descriptions title={t("form.title")} column={2} bordered size="small">
        <Descriptions.Item label={t("form.code.label")}>
          {d?.code}
        </Descriptions.Item>
        <Descriptions.Item label={t("form.name.label")}>
          {d?.name}
        </Descriptions.Item>
        <Descriptions.Item label={t("form.address.label")}>
          {d?.address}
        </Descriptions.Item>
        <Descriptions.Item label={t("form.phone.label")}>
          {d?.phone}
        </Descriptions.Item>
        <Descriptions.Item label={t("form.warehouses.label")} span={2}>
          {(d?.warehouses || [])
            .map((w: any) => `${w.code} — ${w.name}`)
            .join(", ") || "-"}
        </Descriptions.Item>
      </Descriptions>
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  customers: state.wmsCustomers,
});
const mapDispatchToProps = {
  getCustomerDetail: wmsCustomerActions.getCustomerDetailFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);
