import Form from "./menu-configuration-form";
import Header from "./menu-configuration-header";

interface MenuConfigurationProps {
  children: React.ReactNode;
}

const MenuConfiguration = ({ children }: MenuConfigurationProps) => ({
  children,
});

MenuConfiguration.Header = Header;
MenuConfiguration.Form = Form;

export default MenuConfiguration;
