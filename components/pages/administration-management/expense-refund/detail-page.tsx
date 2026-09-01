import Tabs from "@sera-components/tabs";
import SharedUtils from "@sera-utils/shared-utils";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/router";
import React, { useState } from "react";

import ExpenseDetails from "./expense-detail";
import ShipmentDetails from "./shipment-detail";

interface IProps {
  id: string;
  shipmentExpenseId: string;
}

const DetailPageComponent = ({ id, shipmentExpenseId }: IProps) => {
  const router = useRouter();
  const [formDriver1] = useForm();
  const [formDriver2] = useForm();

  const { activeKey } = router.query;

  const [activeTab, setActiveTab] = useState<string | any>(
    activeKey ?? "expense-detail",
  );

  const changeActiveTabKey = (key: string) => {
    if (key !== activeKey) {
      SharedUtils().changeActiveTabKey(key, setActiveTab, router);
    }
  };

  return (
    <Tabs
      noPadding
      destroyInactiveTabPane
      activeKey={activeTab}
      onTabClick={(key: string) => changeActiveTabKey(key)}
      items={[
        {
          key: "shipment-detail",
          label: "Shipment Detail",
          children: <ShipmentDetails id={id} />,
        },
        {
          key: "expense-detail",
          label: "Expense Detail",
          children: (
            <ExpenseDetails
              formDriver1={formDriver1}
              formDriver2={formDriver2}
              id={shipmentExpenseId}
            />
          ),
        },
      ]}
    />
  );
};

export default DetailPageComponent;
