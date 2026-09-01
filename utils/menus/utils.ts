import { MenuOptions } from "./enums";
import { MenuStatus } from "./types";

const Menus = () => {
  function getStatusColor(status: MenuStatus) {
    if (status === "Active") {
      return "#0EC642";
    }
    if (status === "Not Active") {
      return "#f52c48";
    }
    if (status === "Disable") {
      return "#666666";
    }
    return "#000";
  }

  function getMenusOptions() {
    type MenuOptionsType = keyof typeof MenuOptions;
    return Object.keys(MenuOptions).map((e: string) => ({
      label: e,
      value: MenuOptions[e as MenuOptionsType],
    }));
  }

  return {
    getStatusColor,
    getMenusOptions,
  };
};

export default Menus;
