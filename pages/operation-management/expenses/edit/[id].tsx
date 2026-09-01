import PageHeader from "@sera-components/page-header";
import OperationManagement from "@sera-components/pages/operation-management";
import MessageHandler from "@sera-libraries/message-handler";
import { useAppDispatch } from "@sera-redux";
import { expensesActions } from "@sera-redux/slices/expenses.slice";
import { ExpensesPayload } from "@sera-types/expenses.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ExpensesEditPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenses" });
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();

  const callback = () => {
    MessageHandler().success(t("form.message.updateSuccess"));
    router.push(ROUTE.OPERATION_MANAGEMENT.EXPENSES);
  };

  const handleSubmit = async () => {
    try {
      const value = await form.validateFields();
      const payload: ExpensesPayload = {
        customerRouteId: value?.routeCode ?? "",
        branchId: value?.branchId ?? "",
        shipmentType: value?.shipmentType ?? "",
        driverType: value?.driverType ?? "",
        distanceWithCargo: Number(value?.distanceCargo) || 0,
        toleranceWithCargo: Number(value?.toleranceCargo) || 0,
        distanceWithoutCargo: Number(value?.distanceEmpty) || 0,
        toleranceWithoutCargo: Number(value?.toleranceEmpty) || 0,
        fuelCargo: Number(value?.fuelCargo) || 0,
        fuelEmpty: Number(value?.fuelEmpty) || 0,
        fuel: Number(value?.fuel) || 0,
        toll: Number(value?.toll) || 0,
        mell: Number(value?.mell) || 0,
        loadingUnloading: Number(value?.loadingUnloading) || 0,
        harborCrossing: Number(value?.harborCrossing) || 0,
        workerContributions: Number(value?.workerContributions) || 0,
        security: Number(value?.security) || 0,
        incentiveKM: Number(value?.incentiveKm) || 0,
        incentiveDaily: Number(value?.incentiveDaily) || 0,
        incentiveSIO: Number(value?.incentiveSio) || 0,
        documentShippingFee: Number(value?.documentShippingFee) || 0,
        termin1: Number(value?.termin1) || 0,
        termin2: Number(value?.termin2) || 0,
        termin3: Number(value?.termin3) || 0,
        termin4: Number(value?.termin4) || 0,
        termin5: Number(value?.termin5) || 0,
        termin6: Number(value?.termin6) || 0,
      };

      dispatch(
        expensesActions.updateExpensesFetch({
          id: id as string,
          payload,
          callback,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(expensesActions.getExpensesDetailFetch({ id: id as string }));
    }

    return () => {
      dispatch(expensesActions.getExpensesDetailClear());
      dispatch(expensesActions.updateExpensesClear());
    };
  }, [id, form]);

  return (
    <>
      <PageHeader
        title={t("form.title.edit")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.OPERATION_MANAGEMENT.EXPENSES,
          },
          { title: t("breadcrumb.2.edit") },
        ]}
        backUrl={ROUTE.OPERATION_MANAGEMENT.EXPENSES}
        isDirectToURL
      />
      <OperationManagement.ExpensesForm
        form={form}
        type="edit"
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ExpensesEditPage;
