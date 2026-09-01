import { Alert, Button, Col, Form, Input, Row } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import UserApi from "../../../libraries/api/auth";
import styles from "./reset-password-form.module.scss";

export default function ResetPasswordForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { token } = router.query;
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true);

  const onFinishHandler = async (values: {
    password: string;
    passwordConfirmation: string;
  }) => {
    setLoading(true);
    const { data }: any = await UserApi().resetPassword({
      ...values,
      token: token as string,
    });
    setLoading(false);

    const { errors, message }: any = data;
    if (!errors) {
      setErrorMessage("");
      form.setFieldValue("email", "");
      setSuccessMessage(message);
      router.push("/auth");
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
              <Alert message={successMessage} type="success" showIcon />
            </Col>
          )}
          <Col span={24}>
            <Form
              name="reset-password"
              form={form}
              layout="vertical"
              autoComplete="off"
              onFinish={onFinishHandler}
            >
              <Form.Item
                label={t("auth.newPassword.input.newPassword.label")}
                name="password"
                id="password"
                className="sera-input"
                required={false}
                rules={[
                  {
                    required: true,
                    message: t("auth.newPassword.input.newPassword.validation"),
                  },
                ]}
              >
                <Input.Password
                  placeholder={t(
                    "auth.newPassword.input.newPassword.placeholder",
                  )}
                />
              </Form.Item>

              <Form.Item
                label={t("auth.newPassword.input.confirmNewPassword.label")}
                name="passwordConfirmation"
                id="passwordConfirmation"
                className="sera-input"
                required={false}
                rules={[
                  {
                    required: true,
                    message: t(
                      "auth.newPassword.input.confirmNewPassword.validation.message",
                    ),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          t(
                            "auth.newPassword.input.confirmNewPassword.validation.error",
                          ),
                        ),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder={t(
                    "auth.newPassword.input.confirmNewPassword.placeholder",
                  )}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  id="resetPassword"
                  htmlType="submit"
                  className={`${styles["recover-password-form-button"]} ${styles["recover-password-form-button-primary"]}`}
                  loading={loading}
                >
                  {t("auth.newPassword.input.button")}
                </Button>
              </Form.Item>

              <Form.Item>
                <Link id="login" href="/auth/recover-password" passHref>
                  <Image
                    className={styles["arrow-left"]}
                    alt="<"
                    src="/icons/arrow-left.svg"
                    layout="fixed"
                    width={30}
                    height={9}
                    priority
                  />
                  {t("auth.newPassword.button")}
                </Link>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
}
