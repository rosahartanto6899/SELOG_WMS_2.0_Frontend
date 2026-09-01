"use client";

import { Row, Tag, Typography } from "antd";
import React from "react";

export type TStatusType = "A" | "B" | "C";

const PerformanceGrade = ({ value }: { value: TStatusType }) => {
  let performanceColor;
  let textColor;
  let textValue;

  switch (value) {
    case "A":
      performanceColor = "success";
      textColor = "#52c41a";
      textValue = value.toUpperCase();
      break;
    case "B":
      performanceColor = "orange";
      textColor = "#ff7a45";
      textValue = value.toUpperCase();
      break;
    case "C":
      performanceColor = "error";
      textColor = "#f5222d";
      textValue = value.toUpperCase();
      break;
    default:
      break;
  }
  return (
    <Tag style={{ width: 70 }} bordered color={performanceColor}>
      <Row justify={"center"}>
        <Typography.Text style={{ color: textColor }}>
          {textValue}
        </Typography.Text>
      </Row>
    </Tag>
  );
};

export default PerformanceGrade;
