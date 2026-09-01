import { CopyOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Modal from "@sera-components/modal";
import Typography from "@sera-components/typography";
import { Input, Result, Space, Tooltip } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./xendit.module.scss";

const LINK = "https://invoice.xendit.co/askd42KsaLdJMlksajdzahsgdhsadZasd";

const PopupXenditLink = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "xenditLink" });
  const [title, setTitle] = useState<string>(t("tooltip.0"));

  const handleCopyClick = (link: string) => {
    navigator.clipboard.writeText(link);
    setTitle(t("tooltip.1"));
  };

  return (
    <Modal open id="modal-test-success">
      <Result
        status="success"
        title={t("resultTitle")}
        subTitle={
          <div className={styles["margin-top"]}>
            <div>
              <Typography.Text className={styles.text}>
                {t("textRow.0")}{" "}
                <span className={styles.price}>Rp1.200.000</span>
              </Typography.Text>
            </div>
            <div>
              <Typography.Text className={styles.text}>
                {t("textRow.1")}
              </Typography.Text>
            </div>
            <div>
              <Typography.Text className={styles.text}>
                {t("textRow.2")}
              </Typography.Text>
            </div>

            <div className={styles["margin-top"]}>
              <Space.Compact block>
                <Input id="input-copy" value={LINK} />
                <Tooltip title={title}>
                  <Button
                    id="button-copy"
                    icon={<CopyOutlined />}
                    onClick={() => handleCopyClick(LINK)}
                    onMouseLeave={() => {
                      setTimeout(() => {
                        setTitle(t("tooltip.0"));
                      }, 200);
                    }}
                  />
                </Tooltip>
              </Space.Compact>
            </div>
          </div>
        }
      />
    </Modal>
  );
};

export default PopupXenditLink;
