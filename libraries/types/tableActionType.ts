/* eslint-disable no-unused-vars */
import { ReactNode } from "react";

export interface TableAction {
  key: string;
  tooltip: string;
  icon: ReactNode;
  danger: boolean;
  enabled: boolean;
  visible: boolean;
  onClick?: (obj?: object) => void;
}
