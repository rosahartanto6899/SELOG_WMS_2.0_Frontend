import Tabs from "@sera-components/tabs";
import SharedUtils from "@sera-utils/shared-utils";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import SectionAdditionalExpense from "./section-additional-expense";
import SectionAuditTrail from "./section-audit-trail";
import SectionExpenseDetail from "./section-expense-detail";
import SectionShipmentDetail from "./section-shipment-detail";

const ExpenseDetailPageComponent = () => {
  const router = useRouter();
  const { activeKey } = router.query;

  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.detail",
  });
  const id = router.query.id as string;

  const changeActiveTabKey = (_key: string) => {
    if (_key === "additional-expense" || _key !== activeKey) {
      SharedUtils().changeActiveTabKey(_key, () => {}, router);
    }
  };

  return (
    <Tabs
      activeKey={(activeKey as string) ?? "shipment-detail"}
      items={[
        {
          key: "shipment-detail",
          label: t("tabs.0"),
          children: <SectionShipmentDetail id={id} />,
        },
        {
          key: "expense-detail",
          label: t("tabs.1"),
          children: <SectionExpenseDetail />,
        },
        {
          key: "audit-trail",
          label: t("tabs.2"),
          children: <SectionAuditTrail />,
        },
        {
          key: "additional-expense",
          label: t("tabs.3"),
          children: <SectionAdditionalExpense />,
        },
      ]}
      onTabClick={changeActiveTabKey}
      destroyInactiveTabPane
    />
  );
};

export default ExpenseDetailPageComponent;
