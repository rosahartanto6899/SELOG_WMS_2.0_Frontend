import Table from "@sera-components/table";
import { useAppDispatch, useAppSelector } from "@sera-redux";
import { additionalExpenseActions } from "@sera-redux/slices/additional-expense.slice";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { ColumnsAuditTrail } from "../additional-expense-props-table";
const AuditTrail = () => {
  const {
    auditTrail: { data: auditTrailData },
  } = useAppSelector((state) => state.additionalExpense);
  const dispatch = useAppDispatch();

  const router = useRouter();
  const id = router.query.id as string;

  useEffect(() => {
    if (!id) return;
    if (isEmpty(auditTrailData)) {
      dispatch(additionalExpenseActions.getAuditTrailFetch({ id }));
    }
  }, [auditTrailData, id]);

  return (
    <Table
      showTitle={false}
      columns={ColumnsAuditTrail()}
      scroll={{ x: "max-content" }}
      dataSource={auditTrailData.map((v, i) => ({ no: i + 1, ...v }))}
      isCustomSearch={false}
      showActions={false}
    />
  );
};

export default AuditTrail;
