import styles from "@sera-components/status-tag/status-tag.module.scss";
import { Tag } from "antd";

import { STATUS } from "./status";

interface StatusTagProps {
  value: string;
  className?: string;
  block?: boolean;
  fallback?: string;
  label?: string;
  color?: string;
}

const StatusTag = ({
  value,
  className,
  block = false,
  label,
  fallback = "",
  color,
}: StatusTagProps) => {
  if (!value) return null;

  const COLOR: string =
    Object.entries(STATUS).find((val) =>
      val[1].includes(value.toUpperCase()),
    )?.[0] ?? fallback;

  return (
    <Tag
      bordered
      className={`
        ${styles["status-tag"]}
        ${COLOR === "grey2" && styles["grey-tag"]}
        ${COLOR === "white" && styles["white-tag"]}
        ${COLOR === "whiteDashed" && styles["dashed-tag"]}
        ${block && styles["full-width"]}
        ${className}
      `}
      color={color ? (color !== "white" ? color : undefined) : COLOR}
    >
      {label || value}
    </Tag>
  );
};

export default StatusTag;
