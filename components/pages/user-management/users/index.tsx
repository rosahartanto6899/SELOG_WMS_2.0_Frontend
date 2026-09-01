import Form from "./user-management-form";
import InitialPage from "./user-management-initial-page";

interface UserManagementProps {
  children: React.ReactNode;
}

const UserManagement = ({ children }: UserManagementProps) => ({ children });

UserManagement.InitialPage = InitialPage;
UserManagement.Form = Form;

export default UserManagement;
