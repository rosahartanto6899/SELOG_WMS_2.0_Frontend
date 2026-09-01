import { Empty as AntdEmpty, EmptyProps } from "antd";
import { useTranslation } from "react-i18next";

import styles from "./empty.module.scss";

const Empty = (props?: EmptyProps) => {
  const { t } = useTranslation();
  return (
    <AntdEmpty
      className={styles.secondary}
      description={t("global.empty.message")}
      {...props}
    />
  );
};

export default Empty;
