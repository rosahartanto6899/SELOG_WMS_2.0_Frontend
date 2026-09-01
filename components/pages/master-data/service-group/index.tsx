import Form from "./service-group-form";
import InitialPage from "./service-group-initial-page";

interface ServiceGroupProps {
  children: React.ReactNode;
}

const ServiceGroup = ({ children }: ServiceGroupProps) => ({ children });

ServiceGroup.InitialPage = InitialPage;
ServiceGroup.Form = Form;

export default ServiceGroup;
