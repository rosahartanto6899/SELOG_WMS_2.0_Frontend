import Tabs from "@sera-components/tabs";
import SharedUtils from "@sera-utils/shared-utils";
import { useRouter } from "next/router";
import React, { useState } from "react";

import PodDetails from "./pod-detail";
import ShipmentDetails from "./shipment-detail";

interface IProps {
  id: string;
}

const DetailPage = ({ id }: IProps) => {
  const router = useRouter();

  const { activeKey } = router.query;

  const [activeTab, setActiveTab] = useState<string | any>(
    activeKey ?? "pod-detail",
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
          key: "pod-detail",
          label: "POD Detail",
          children: <PodDetails id={id} />,
        },
      ]}
    />
  );
};

export default DetailPage;
