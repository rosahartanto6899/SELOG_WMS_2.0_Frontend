import Form from "./stock-management-form";
import FormKMCheck from "./stock-management-form-km-check";
import InitialPage from "./stock-management-initial-page";
import UpsertBulk from "./stock-management-upsert-bulk";

interface StockManagementProps {
  children: React.ReactNode;
}

const StockManagement = ({ children }: StockManagementProps) => ({
  children,
});

StockManagement.InitialPage = InitialPage;
StockManagement.Form = Form;
StockManagement.FormKMCheck = FormKMCheck;
StockManagement.UpsertBulk = UpsertBulk;

export default StockManagement;
