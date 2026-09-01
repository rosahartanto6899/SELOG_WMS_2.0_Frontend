import Card from "@sera-components/card";
import Table from "@sera-components/table";
import { useAppSelector } from "@sera-redux";
import {
  AdditionalExpenseDetailDriver,
  additionalExpenseTypes,
  ShipmentExpenseDetail,
} from "@sera-types/additional-expense.type";
import { Flex } from "antd";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";

import { ColumnExpensesDetailDriver } from "../additional-expense-props-table";

const ExpenseDetail = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense.form",
  });

  const router = useRouter();
  const shipmentExpenseId = router.query.shipmentExpenseId as string;

  const {
    expenseDetail: { data: _expenseDetailData },
  } = useAppSelector((state) => state.additionalExpense);

  const loading = useAppSelector((state) => state.loading);
  const expenseDetail = _expenseDetailData.find(
    (o) => o.id === shipmentExpenseId,
  );

  const driver1Termin =
    expenseDetail?.details?.filter((v) => v.driverType === "driver1") || [];

  const driver2Termin =
    expenseDetail?.details?.filter((v) => v.driverType === "driver2") || [];

  const getTerminData = (
    termin: ShipmentExpenseDetail[],
  ): AdditionalExpenseDetailDriver[] => {
    if (isEmpty(expenseDetail)) return [];

    return termin.map((o, i) => ({
      no: i + 1,
      approvalNote: o?.approvalNote ?? "",
      amount: o.amount ?? 0,
      bphNumber: o.bphNumber ?? "",
      note: o.note ?? "",
      referenceNumber: o.referenceNumber ?? "",
      status: o.status ?? "",
      termin: `Termin ${o.termin}`,
      transferredDate: o.transferredDate ?? "",
      umNumber: o.umNumber ?? "",
    }));
  };

  const columnDetailDriver = ColumnExpensesDetailDriver();

  return (
    <Flex vertical gap={24}>
      <Card title={t(`shipmentDetail.driverInformation.driver1.title`)}>
        <Table
          showTitle={false}
          columns={columnDetailDriver}
          scroll={{ x: "max-content" }}
          loading={
            loading[additionalExpenseTypes.GET_ADDITIONAL_EXPENSE_DETAIL]
          }
          dataSource={getTerminData(driver1Termin)}
          isCustomSearch={false}
          showActions={false}
        />
      </Card>

      {driver2Termin.length > 0 && (
        <Card title={t(`shipmentDetail.driverInformation.driver2.title`)}>
          <Table
            showTitle={false}
            columns={columnDetailDriver}
            scroll={{ x: "max-content" }}
            loading={
              loading[additionalExpenseTypes.GET_ADDITIONAL_EXPENSE_DETAIL]
            }
            dataSource={getTerminData(driver2Termin)}
            isCustomSearch={false}
            showActions={false}
          />
        </Card>
      )}
    </Flex>
  );
};

export default ExpenseDetail;
