import Form from "./master-company-form";
import InitialPage from "./master-company-initial-page";

interface MasterCompanyProps {
  children: React.ReactNode;
}

const MasterCompany = ({ children }: MasterCompanyProps) => ({
  children,
});

MasterCompany.InitialPage = InitialPage;
MasterCompany.Form = Form;

export default MasterCompany;
