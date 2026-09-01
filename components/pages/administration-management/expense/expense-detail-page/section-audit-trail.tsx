/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import Table from "@sera-components/table";
import { RootState } from "@sera-redux";
import { expenseActions } from "@sera-redux/slices/expense-monitoring.slice";
import {
  AuditTrail,
  ExpenseState,
  expenseTypes,
} from "@sera-types/expense-monitoring";
import { LoadingState } from "@sera-types/loading.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { ColumnsAuditTrail } from "./detail-props-table";

interface SectionAuditTrailProps {
  loading: LoadingState;
  expenseMonitoring: ExpenseState;
  getAuditTrail: typeof expenseActions.getAuditTrailFetch;
}

const SectionAuditTrail = ({
  loading,
  expenseMonitoring,
  getAuditTrail,
}: SectionAuditTrailProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.detail.auditTrail.table",
  });

  const { id } = router.query;

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler(
      "/pages/administration-management/expense-monitoring/audit-trail",
    );

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    try {
      getAuditTrail({ id });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 69, error);
      else sendErrorHandler("useEffect", 69, error?.data?.message);
    }
  }, [id]);

  return (
    <Card title={t("subtitle")}>
      <Table
        title={t("title")}
        columns={ColumnsAuditTrail()}
        dataSource={
          expenseMonitoring?.getAuditTrail?.data?.map((_item, _index) => ({
            no: _index + 1,
            ..._item,
          })) ?? []
        }
        rowKey={(row: AuditTrail) => `${row.no}`}
        scroll={{ x: "max-content" }}
        loading={loading[expenseTypes.GET_AUDIT_TRAIL]}
      />
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  expenseMonitoring: state.expenseMonitoring,
});

const mapDispatchToProps = {
  getAuditTrail: expenseActions.getAuditTrailFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionAuditTrail);
