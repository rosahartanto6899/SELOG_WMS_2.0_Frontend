import Form from "./master-branch-form";
import InitialPage from "./master-branch-initial-page";
interface MasterBranchProps {
  children: React.ReactNode;
}

const MasterBranch = ({ children }: MasterBranchProps) => ({ children });

MasterBranch.InitialPage = InitialPage;
MasterBranch.Form = Form;

export default MasterBranch;
