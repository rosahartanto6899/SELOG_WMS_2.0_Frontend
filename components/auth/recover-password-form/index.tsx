import { Alert, Button, Col, Form, Input, Row } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import UserApi from "../../../libraries/api/auth";
import styles from "./recover-password-form.module.scss";

const RecoverPasswordForm = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true);

  const onFinishHandler = async (values: { email: string }) => {
    setLoading(true);
    const { data }: any = await UserApi().checkResetPassword(values);
    setLoading(false);

    const { errors, message }: any = data;
    if (!errors) {
      setErrorMessage("");
      form.setFieldValue("email", "");
      setSuccessMessage(message);
    } else {
      form.setFieldValue("email", "");
      setErrorMessage(message);
      setSuccessMessage("");
    }

    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  return (
    <div className={styles["recover-password-wrapper"]}>
      <div className={styles["recover-password-container"]}>
        <Row justify="center" style={{ marginBottom: "5rem" }}>
          <Col>
            <div className={styles["recover-password-logo"]} />
          </Col>
        </Row>
        <Row justify="center" gutter={[8, 8]}>
          {errorMessage && visible && (
            <Col span={24}>
              <Alert message={errorMessage} type="error" showIcon />
            </Col>
          )}
          {successMessage && visible && (
            <Col span={24}>
              <Alert
                message={t("global.recovery.success")}
                type="success"
                showIcon
              />
            </Col>
          )}
          <Col span={24}>
            <Form
              name="recover-password"
              form={form}
              layout="vertical"
              autoComplete="off"
              onFinish={onFinishHandler}
            >
              <Form.Item
                label={t("auth.recoverPassword.input.email.label")}
                name="email"
                id="email"
                className="sera-input"
                required={false}
                rules={[
                  {
                    required: true,
                    message: t("auth.recoverPassword.input.email.validation"),
                  },
                ]}
              >
                <Input
                  placeholder={t(
                    "auth.recoverPassword.input.email.placeholder",
                  )}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  id="recoverPassword"
                  htmlType="submit"
                  className={`${styles["recover-password-form-button"]} ${styles["recover-password-form-button-primary"]}`}
                  loading={loading}
                >
                  {t("auth.recoverPassword.input.button")}
                </Button>
              </Form.Item>

              <Form.Item>
                <Link id="login" href="/auth" passHref>
                  <Image
                    className={styles["arrow-left"]}
                    alt="<"
                    src="/icons/arrow-left.svg"
                    layout="fixed"
                    width={30}
                    height={9}
                    priority
                  />
                  {t("auth.recoverPassword.button")}
                </Link>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RecoverPasswordForm;
