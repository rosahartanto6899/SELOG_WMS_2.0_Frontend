import AdditionalExpenseForm from "./additional-expense/additional-expense-form";
import AdditionalExpenseList from "./additional-expense/additional-expense-initial-page";
import ShipmentCancellationsForm from "./shipment-cancellations/shipment-cancellations-form";
import ShipmentCancellationsList from "./shipment-cancellations/shipment-cancellations-initial-page";

const ApprovalsManagementComponent = {
  AdditionalExpenseInitialPage: AdditionalExpenseList,
  AdditionalExpenseDetail: AdditionalExpenseForm,
  ShipmentCancellationsInitialPage: ShipmentCancellationsList,
  ShipmentCancellationsDetail: ShipmentCancellationsForm,
};

export default ApprovalsManagementComponent;
