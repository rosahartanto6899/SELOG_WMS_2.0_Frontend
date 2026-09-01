import Form from "./master-vehicle-type-form";
import Header from "./master-vehicle-type-header";
import InitialPage from "./master-vehicle-type-initial-page";

interface MasterVehicleTypeProps {
  children: React.ReactNode;
}

const MasterVehicleType = ({ children }: MasterVehicleTypeProps) => ({
  children,
});

MasterVehicleType.InitialPage = InitialPage;
MasterVehicleType.Form = Form;
MasterVehicleType.Header = Header;

export default MasterVehicleType;
