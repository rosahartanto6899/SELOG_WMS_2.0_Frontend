import { Card, CardProps } from "antd";
import React, { CSSProperties, ReactNode } from "react";

import styles from "./card-container.module.scss";

export interface CardContainerProps extends CardProps {
  children?: ReactNode;
  style?: CSSProperties;
  title?: string;
  extra?: React.ReactNode;
}

const CardContainer = (props: CardContainerProps) => {
  const { extra, title, className, style, children } = props;

  return (
    <Card
      {...props}
      extra={extra}
      title={title}
      className={`${className} ${styles["sera-card-container"]}`}
      style={style}
    >
      {children}
    </Card>
  );
};
export default CardContainer;
