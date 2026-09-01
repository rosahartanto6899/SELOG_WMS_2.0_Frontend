import { Card } from "antd";
import React, { ReactNode } from "react";

import styles from "./card-container-form-action.module.scss";

export interface CardFormActionsProps {
  children?: ReactNode;
}

const CardFormActions = (props: CardFormActionsProps) => {
  const { children } = props;

  return (
    <Card bordered={false} className={styles["sera-card-form-actions"]}>
      {children}
    </Card>
  );
};
export default CardFormActions;
