/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs as AntdTabs, TabsProps as AntdTabsProps } from "antd";
import React from "react";

import styles from "./tabs.module.scss";

export interface TabsProps extends AntdTabsProps {
  overrideStyle?: boolean;
  noPadding?: boolean;
  tabType?: "line" | "card";
  onTabClick?: (key: string, event: any) => void;
}

const defaultProps = {
  overrideStyle: false,
  noPadding: false,
};

const Tabs: React.FC<TabsProps> = (props: TabsProps) => {
  const {
    noPadding,
    overrideStyle,
    className,
    tabType,
    items,
    activeKey,
    onTabClick,
    tabBarExtraContent,
  } = props;
  let newClassname = "";

  if (noPadding) {
    newClassname = styles["no-padding"];
  }
  if (overrideStyle) {
    newClassname += ` ${className}`;
  } else {
    newClassname += ` ${styles["sera-tabs"]} ${className} ${tabType === "card" ? styles.card : ""}`;
  }

  return (
    <AntdTabs
      tabBarExtraContent={tabBarExtraContent}
      className={newClassname}
      type={tabType}
      items={items}
      activeKey={activeKey}
      onTabClick={onTabClick}
    />
  );
};

Tabs.defaultProps = defaultProps;

export default Tabs;
