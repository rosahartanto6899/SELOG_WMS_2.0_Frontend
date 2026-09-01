/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-key */
import { Avatar, Button, Card } from "antd";
import React, { ReactNode } from "react";

import ArrowRight from "../icons/ArrowRight";
import styles from "./card-menu.module.scss";

export interface ICardMenuProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const CardMenu = (props: ICardMenuProps): JSX.Element => {
  const { title, onClick, icon, description } = props;

  return (
    <Card
      key={title}
      className={styles["sera-card-menu"]}
      onClick={onClick || undefined}
      actions={[
        <Button id={`id-${title}`} type="link" onClick={onClick || undefined}>
          <ArrowRight />
        </Button>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar icon={icon} />}
        title={title}
        description={description}
      />
    </Card>
  );
};

export default CardMenu;
