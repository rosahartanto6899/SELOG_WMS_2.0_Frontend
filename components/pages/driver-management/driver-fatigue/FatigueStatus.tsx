"use client";

import { Row, Tag, Typography } from "antd";
import React from "react";

export type TStatusType =
  | "low"
  | "medium"
  | "high"
  | "fit"
  | "fit_with_note"
  | "unfit"
  | "Fit"
  | "Fit With Note"
  | "Unfit";

const FatigueStatus = ({
  value,
  width = 70,
}: {
  value: TStatusType;
  width?: number;
}) => {
  let fatigueColor;
  let textColor;
  let textValue;

  switch (value) {
    case "low":
    case "fit":
    case "Fit":
      fatigueColor = "success";
      textColor = "#52c41a";
      textValue = value.toUpperCase();
      break;
    case "medium":
      fatigueColor = "orange";
      textColor = "#ff7a45";
      textValue = value.toUpperCase();
      break;
    case "fit_with_note":
    case "Fit With Note":
      textValue = "FIT WITH NOTE";
      fatigueColor = "orange";
      textColor = "#ff7a45";
      break;
    case "high":
    case "unfit":
    case "Unfit":
      fatigueColor = "error";
      textColor = "#f5222d";
      textValue = value.toUpperCase();
      break;
    default:
      break;
  }
  return (
    <Tag style={{ width }} bordered color={fatigueColor}>
      <Row justify={"center"}>
        <Typography.Text
          style={{ color: textColor, fontSize: 13, fontWeight: 500 }}
        >
          {textValue}
        </Typography.Text>
      </Row>
    </Tag>
  );
};

export default FatigueStatus;
