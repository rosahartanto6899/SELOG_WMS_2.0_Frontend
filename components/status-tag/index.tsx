import styles from "@sera-components/status-tag/status-tag.module.scss";
import { Tag, Tooltip } from "antd";
import type { CSSProperties } from "react";

import { STATUS } from "./status";

interface StatusTagProps {
  value: string;
  className?: string;
  block?: boolean;
  fallback?: string;
  label?: string;
  color?: string;
  indicatorColor?: string;
  indicatorTooltip?: string;
}

const StatusTag = ({
  value,
  className,
  block = false,
  label,
  fallback = "",
  color,
  indicatorColor,
  indicatorTooltip,
}: StatusTagProps) => {
  if (!value) return null;

  const COLOR: string =
    Object.entries(STATUS).find((val) =>
      val[1].includes(value.toUpperCase()),
    )?.[0] ?? fallback;

  const content = (
    <span className={styles["tag-inner"]}>
      {indicatorColor && (
        <span
          className={styles["tag-indicator-dot"]}
          style={{ "--dot-c": indicatorColor } as CSSProperties}
        />
      )}
      <span className={styles["tag-text"]}>{label || value}</span>
    </span>
  );

  const tagNode = (
    <Tag
      bordered
      className={`
        ${styles["status-tag"]}
        ${COLOR === "grey2" ? styles["grey-tag"] : ""}
        ${COLOR === "white" ? styles["white-tag"] : ""}
        ${COLOR === "whiteDashed" ? styles["dashed-tag"] : ""}
        ${block ? styles["full-width"] : ""}
        ${indicatorColor ? styles["has-indicator"] : ""}
        ${className ?? ""}
      `}
      color={color ? (color !== "white" ? color : undefined) : COLOR}
    >
      {content}
    </Tag>
  );

  if (indicatorTooltip) {
    return (
      <Tooltip title={indicatorTooltip} placement="top">
        {tagNode}
      </Tooltip>
    );
  }

  return tagNode;
};

export default StatusTag;
