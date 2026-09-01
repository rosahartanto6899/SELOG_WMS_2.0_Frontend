/* eslint-disable react-hooks/exhaustive-deps */
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import { RootState, wmsWarehouseActions } from "@sera-redux";
import { WmsWarehouseState } from "@sera-types/customer.type";
import { Descriptions } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const WarehouseDetail = ({
  warehouses,
  getWarehouseDetail,
}: {
  warehouses: WmsWarehouseState;
  getWarehouseDetail: typeof wmsWarehouseActions.getWarehouseDetailFetch;
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(undefined, { keyPrefix: "warehouseManagement" });

  const LOCATION_BREADCRUMBS = [
    { title: t("breadcrumb.0.title") },
    { title: t("breadcrumb.1.title") },
  ];

  useEffect(() => {
    if (id) getWarehouseDetail({ id: id as string });
  }, [id]);

  const d = warehouses.warehouseDetail.data;

  return (
    <LayoutUserManagement
      titlePage={t("title")}
      locationUrlList={LOCATION_BREADCRUMBS}
    >
      <Descriptions title={t("form.title")} column={2} bordered size="small">
        <Descriptions.Item label={t("form.customer.label")}>
          {d?.customer?.name ?? "-"}
        </Descriptions.Item>
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
      </Descriptions>
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  warehouses: state.wmsWarehouses,
});
const mapDispatchToProps = {
  getWarehouseDetail: wmsWarehouseActions.getWarehouseDetailFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseDetail);
