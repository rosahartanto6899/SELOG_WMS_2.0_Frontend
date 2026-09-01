import PageHeader from "@sera-components/page-header";
import OperationManagement from "@sera-components/pages/operation-management";
import MessageHandler from "@sera-libraries/message-handler";
import { expensesActions, useAppDispatch } from "@sera-redux";
import { ExpensesPayload } from "@sera-types/expenses.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const ExpensesAddPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "expenses" });
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const callback = () => {
    MessageHandler().success(t("form.message.createSuccess"));
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
        expensesActions.createExpensesFetch({
          payload,
          callback,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <PageHeader
        title={t("form.title.add")}
        breadcrumb={[
          { title: t("breadcrumb.0") },
          {
            title: t("breadcrumb.1"),
            url: ROUTE.OPERATION_MANAGEMENT.EXPENSES,
          },
          { title: t("breadcrumb.2.add") },
        ]}
        backUrl={ROUTE.OPERATION_MANAGEMENT.EXPENSES}
        isDirectToURL
      />
      <OperationManagement.ExpensesForm
        form={form}
        type="create"
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ExpensesAddPage;
