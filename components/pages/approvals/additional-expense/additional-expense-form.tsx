import Tabs from "@sera-components/tabs";
import { useAppDispatch } from "@sera-redux";
import { additionalExpenseActions } from "@sera-redux/slices/additional-expense.slice";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import styles from "./additional-expense.module.scss";
import AdditionalExpense from "./components/additional-expense-detail";
import AuditTrail from "./components/audit-trail-detail";
import ExpenseDetail from "./components/expense-detail";
import ShipmentDetail from "./components/shipment-detail";

export type ADDITIONAL_EXPENSE_FORM_TAB_KEYS =
  | "shipmentDetail"
  | "expenseDetail"
  | "auditTrail"
  | "additionalExpense";

const AdditionalExpenseForm = () => {
  const [activeTab, setActiveTab] =
    useState<ADDITIONAL_EXPENSE_FORM_TAB_KEYS>("additionalExpense");

  const handleChangeTabs = (key: ADDITIONAL_EXPENSE_FORM_TAB_KEYS) => {
    setActiveTab(key);
  };

  const dispatch = useAppDispatch();

  const router = useRouter();

  const id = router.query.id as string;

  useEffect(() => {
    if (!id) return;
    dispatch(additionalExpenseActions.getExpenseDetailFetch({ id }));

    return () => {
      dispatch(additionalExpenseActions.getExpenseDetailClear());
    };
  }, [id]);

  return (
    <Tabs
      noPadding
      destroyInactiveTabPane
      activeKey={activeTab}
      onTabClick={(key) =>
        handleChangeTabs(key as ADDITIONAL_EXPENSE_FORM_TAB_KEYS)
      }
      items={[
        {
          key: "shipmentDetail",
          label: "Shipment Detail",
          children: (
            <div
              className={styles["additional-expense-detail-overview-wrapper"]}
            >
              <div
                className={
                  styles["additional-expense-detail-overview-wrapper__content"]
                }
              >
                <ShipmentDetail id={id} />
              </div>
            </div>
          ),
        },
        {
          key: "expenseDetail",
          label: "Expense Detail",
          children: (
            <div
              className={styles["additional-expense-detail-overview-wrapper"]}
            >
              <div
                className={
                  styles["additional-expense-detail-overview-wrapper__content"]
                }
              >
                <ExpenseDetail />
              </div>
            </div>
          ),
        },
        {
          key: "auditTrail",
          label: "Audit Trail",
          children: (
            <div
              className={styles["additional-expense-detail-overview-wrapper"]}
            >
              <div
                className={
                  styles["additional-expense-detail-overview-wrapper__content"]
                }
              >
                <AuditTrail />
              </div>
            </div>
          ),
        },
        {
          key: "additionalExpense",
          label: "Additional Expense",
          children: (
            <div
              className={styles["additional-expense-detail-overview-wrapper"]}
            >
              <div
                className={
                  styles["additional-expense-detail-overview-wrapper__content"]
                }
              >
                <AdditionalExpense />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};

export default AdditionalExpenseForm;
