import Tabs from "@sera-components/tabs";
import {
  bookingOrderActions,
  orderStatusActions,
  shipmentCancellationsActions,
  useAppDispatch,
} from "@sera-redux";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import ApprovalConfirmation from "./components/approval-confirmation";
import ApprovalHistory from "./components/approval-history";
import ShipmentDetail from "./components/shipment-detail";
import styles from "./shipment-cancellations.module.scss";

export type SHIPMENT_CANCELLATIONS_FORM_TAB_KEYS =
  | "shipmentDetail"
  | "approvalHistory"
  | "approvalConfirmation";

const ShipmentCancellationsForm = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] =
    useState<SHIPMENT_CANCELLATIONS_FORM_TAB_KEYS>("approvalConfirmation");

  const handleChangeTabs = (key: SHIPMENT_CANCELLATIONS_FORM_TAB_KEYS) => {
    setActiveTab(key);
  };

  const router = useRouter();

  const id = router.query.id as string;
  const approvalId = router.query.approvalId as string;

  useEffect(() => {
    dispatch(bookingOrderActions.getDropdownAdditionalRequestItemsFetch());
    return () => {
      dispatch(bookingOrderActions.getDropdownAdditionalRequestItemsClear());
    };
  }, []);

  useEffect(() => {
    if (!id || !approvalId) return;
    dispatch(orderStatusActions.getOrderStatusDetailFetch({ id }));
    dispatch(
      shipmentCancellationsActions.getApprovalHistoryFetch({ id: approvalId }),
    );

    return () => {
      dispatch(orderStatusActions.getOrderStatusDetailClear());
      dispatch(shipmentCancellationsActions.getApprovalHistoryClear());
    };
  }, [id, approvalId]);

  return (
    <Tabs
      noPadding
      destroyInactiveTabPane
      activeKey={activeTab}
      onTabClick={(key) =>
        handleChangeTabs(key as SHIPMENT_CANCELLATIONS_FORM_TAB_KEYS)
      }
      items={[
        {
          key: "shipmentDetail",
          label: "Shipment Detail",
          children: (
            <div
              className={
                styles["shipment-cancellations-detail-overview-wrapper"]
              }
            >
              <div
                className={
                  styles[
                    "shipment-cancellations-detail-overview-wrapper__content"
                  ]
                }
              >
                <ShipmentDetail id={id} />
              </div>
            </div>
          ),
        },
        {
          key: "approvalHistory",
          label: "Approval History",
          children: (
            <div
              className={
                styles["shipment-cancellations-detail-overview-wrapper"]
              }
            >
              <div
                className={
                  styles[
                    "shipment-cancellations-detail-overview-wrapper__content"
                  ]
                }
              >
                <ApprovalHistory />
              </div>
            </div>
          ),
        },
        {
          key: "approvalConfirmation",
          label: "Approval Confirmation",
          children: (
            <div
              className={
                styles["shipment-cancellations-detail-overview-wrapper"]
              }
            >
              <div
                className={
                  styles[
                    "shipment-cancellations-detail-overview-wrapper__content"
                  ]
                }
              >
                <ApprovalConfirmation />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};

export default ShipmentCancellationsForm;
