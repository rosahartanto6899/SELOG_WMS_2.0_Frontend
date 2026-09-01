import DetailPage from "./expense-detail-page";
import InitialPage from "./expense-initial-page";

interface ExpenseProps {
  children: React.ReactNode;
}

const Expense = ({ children }: ExpenseProps) => ({
  children,
});

Expense.InitialPage = InitialPage;
Expense.DetailPage = DetailPage;

export default Expense;
