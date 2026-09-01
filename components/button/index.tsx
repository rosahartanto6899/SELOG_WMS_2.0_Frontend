import {
  Button as AntdButton,
  ButtonProps as AntdButtonProps,
  Tooltip,
} from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";

import styles from "./button.module.scss";

export interface ButtonProps extends Omit<AntdButtonProps, "variant"> {
  tooltip?: string;
  warning?: boolean;
  variant?:
    | "link"
    | "text"
    | "dashed"
    | "outlined"
    | "solid"
    | "filled"
    | "primary-outlined"
    | "icon-blue";
  placement?: TooltipPlacement;
}
const Button = (props: ButtonProps) => {
  const {
    tooltip,
    placement,
    children,
    className,
    warning,
    variant,
    ...restProps
  } = props;
  const tooltipPosition = placement || "top";
  const buttonProps = {
    ...restProps,
    className: `${className ?? ""}`,
    variant:
      variant !== "primary-outlined" && variant !== "icon-blue"
        ? variant
        : undefined,
  };
  if (variant === "primary-outlined") {
    return (
      <Tooltip title={tooltip || null} placement={tooltipPosition}>
        <AntdButton
          {...buttonProps}
          className={`${className ?? ""}${styles.primary_outlined}`}
        >
          {children}
        </AntdButton>
      </Tooltip>
    );
  }
  if (variant === "icon-blue") {
    return (
      <Tooltip title={tooltip || null} placement={tooltipPosition}>
        <AntdButton
          {...buttonProps}
          className={`${className ?? ""}${styles.icon_blue}`}
        >
          {children}
        </AntdButton>
      </Tooltip>
    );
  }
  return (
    <Tooltip title={tooltip || null} placement={tooltipPosition}>
      <AntdButton
        {...buttonProps}
        className={`${className ?? ""}${warning ? styles.warning : ""}`}
      >
        {children}
      </AntdButton>
    </Tooltip>
  );
};
export default Button;
