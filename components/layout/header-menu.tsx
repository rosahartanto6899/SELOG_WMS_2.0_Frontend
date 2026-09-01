import { Menu } from "antd";
import { ItemType } from "antd/lib/menu/interface";

interface HeaderMenuProps {
  menuData?: ItemType[];
}

const HeaderMenu = (props: HeaderMenuProps) => {
  const { menuData } = props;
  return <Menu items={menuData} style={{ top: "1.8rem" }} />;
};

export default HeaderMenu;
