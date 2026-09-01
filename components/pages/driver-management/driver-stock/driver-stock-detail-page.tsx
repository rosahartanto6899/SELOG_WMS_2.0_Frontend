/* eslint-disable @typescript-eslint/no-explicit-any */

import Tabs from "@sera-components/tabs";
import SharedUtils from "@sera-utils/shared-utils";
import { Form } from "antd";
import dayjs from "dayjs";
import { isNil } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

import DriverStockDetailDocument from "./driver-stock-detail-document";
import DriverStockDetailEmployment from "./driver-stock-detail-employment";
import DriverStockDetailHistorical from "./driver-stock-detail-historical";
import DriverStockDetailPersonal from "./driver-stock-detail-personal";
import useDriverStock from "./hooks/useDriverStock";

const DriverStockDetailPage = ({ id }: { id: string }) => {
  const router = useRouter();
  const { activeKey } = router.query;
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string | any>(
    activeKey ?? "personal",
  );
  const changeActiveTabKey = (key: string) => {
    if (key !== activeKey) {
      SharedUtils().changeActiveTabKey(key, setActiveTab, router);
    }
  };

  const {
    queries: { fetchById },
    data: { detailsData },
    loading: { loadingDetails },
  } = useDriverStock();

  useEffect(() => {
    fetchById(id);
  }, [id]);

  useEffect(() => {
    if (detailsData) {
      form.setFieldsValue({
        ...detailsData,
        name: detailsData.employeeName,
        age: dayjs().diff(detailsData.birthDate, "year"),
        lastPreTripDate: !isNil(detailsData?.historical?.lastPreTripDate)
          ? dayjs(detailsData.historical?.lastPreTripDate).format(
              "YYYY-MM-DD HH:mm:ss",
            )
          : "-",
        lastPreTripResult: detailsData?.historical?.lastPreTripResult ?? "-",
        lastLocation: detailsData?.historical?.lastLocation ?? "-",
        fatigueStatus: detailsData?.historical?.fatigueStatus ?? "-",
        driverStatus: detailsData?.capacityStatus,
      });
    }
  }, [detailsData]);

  return (
    <Form form={form} layout="vertical" disabled autoComplete="off">
      <Tabs
        noPadding
        destroyInactiveTabPane
        activeKey={activeTab}
        onTabClick={(key: string) => changeActiveTabKey(key)}
        items={[
          {
            key: "personal",
            label: "Personal Information",
            children: (
              <DriverStockDetailPersonal loading={Boolean(loadingDetails)} />
            ),
          },
          {
            key: "employment",
            label: "Employment Information",
            children: (
              <DriverStockDetailEmployment
                loading={Boolean(loadingDetails)}
                data={detailsData}
              />
            ),
          },
          {
            key: "document",
            label: "Documents & Banking",
            children: (
              <DriverStockDetailDocument loading={Boolean(loadingDetails)} />
            ),
          },
          {
            key: "historical",
            label: "Historical",
            children: (
              <DriverStockDetailHistorical loading={Boolean(loadingDetails)} />
            ),
          },
        ]}
      />
    </Form>
  );
};
const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DriverStockDetailPage);
