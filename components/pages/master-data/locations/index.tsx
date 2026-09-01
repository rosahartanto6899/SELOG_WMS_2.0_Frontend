import Form from "./master-location-form";
import InitialPage from "./master-locations-initial-page";
interface MasterLocationProps {
  children: React.ReactNode;
}

const MasterLocation = ({ children }: MasterLocationProps) => ({ children });

MasterLocation.InitialPage = InitialPage;
MasterLocation.Form = Form;

export default MasterLocation;
