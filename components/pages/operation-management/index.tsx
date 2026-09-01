import FormApproval from "./approval-booking-order/approval-booking-form";
import InitialPageApproval from "./approval-booking-order/approval-booking-initial-page";
import EmptyMilesForm from "./empty-miles/empty-miles-form";
import EmptyMilesInitialPage from "./empty-miles/empty-miles-initial-page";
import ExpensesForm from "./expenses/expenses-form";
import ExpensesInitialPage from "./expenses/expenses-initial-page";
import ExpensesUpsert from "./expenses/expenses-upsert";
import Form from "./unit-driver-capacity/unit-driver-capacity-form";
import InitialPage from "./unit-driver-capacity/unit-driver-capacity-initial-page";
interface OperationManagementProps {
  children: React.ReactNode;
}

const OperationManagement = ({ children }: OperationManagementProps) => ({
  children,
});

OperationManagement.UnitDriverInitialPage = InitialPage;
OperationManagement.UnitDriverForm = Form;
OperationManagement.InitialPageApproval = InitialPageApproval;
OperationManagement.FormApproval = FormApproval;
OperationManagement.ExpensesInitialPage = ExpensesInitialPage;
OperationManagement.ExpensesForm = ExpensesForm;
OperationManagement.ExpensesUpsert = ExpensesUpsert;
OperationManagement.EmptyMilesInitialPage = EmptyMilesInitialPage;
OperationManagement.EmptyMilesForm = EmptyMilesForm;

export default OperationManagement;
