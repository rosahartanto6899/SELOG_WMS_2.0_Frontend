/* eslint-disable @typescript-eslint/no-explicit-any */
import FormActions from "@sera-components/hocs/form-actions";
import { LayoutUserManagement } from "@sera-components/pages/user-management";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState } from "@sera-redux";
import { roleActions } from "@sera-redux/slices/role.slice";
import { LoadingState } from "@sera-types/loading.type";
import { RoleState, roleTypes } from "@sera-types/role.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { NextAppPage } from "@sera-utils/types";
import Utils from "@sera-utils/utils";
import { Button, Card, Col, Form, Input, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import styles from "./add-role.module.scss";

interface AddRoleProps {
  roles: RoleState;
  createNewRole: typeof roleActions.createNewRoleFetch;
  loading: LoadingState;
}

const AddRole: NextAppPage<AddRoleProps> = (props: AddRoleProps) => {
  const { roles, createNewRole, loading } = props;

  const { t: tPage } = useTranslation(undefined, { keyPrefix: "roles.add" });
  const { t: tForm } = useTranslation(undefined, { keyPrefix: "roles.form" });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/user-management/roles/add/index");

  const LOCATION_BREADCRUMBS: {
    title: string;
    href?: string;
  }[] = [
    {
      title: tPage("breadcrumb.0.title"),
    },
    {
      title: tPage("breadcrumb.1.title"),
      href: "/user-management/roles",
    },
    {
      title: tPage("breadcrumb.2.title"),
    },
  ];

  const [form] = Form.useForm();
  const router = useRouter();

  const handleCreateRole = () => {
    form
      .validateFields()
      .then((values) => {
        const errorHandler = MessageHandler().error;

        const formData = {
          roleName: values.roleName,
        };

        try {
          createNewRole(formData);
        } catch (err) {
          if (isApiResponse(err))
            sendErrorHandlerApi("handleCreateRole", 47, err, errorHandler);
          else
            sendErrorHandler(
              "handleCreateRole",
              47,
              "createNewRole Failed",
              errorHandler,
            );
        }
      })
      .catch((err: any) => {
        const messageHandler = MessageHandler();
        // messageHandler.error({ content: tPage("alert") });

        if (isApiResponse(err))
          sendErrorHandlerApi(
            "handleCreateRole",
            47,
            err,
            messageHandler.error,
          );
      });
  };

  const onGoBack = () => {
    Utils().onGoBack(router, ROUTE.USER_MANAGEMENT.ROLES);
  };

  useEffect(() => {
    if (roles.error) {
      if ((roles.error as any)?.data?.errors) {
        const errorData = (roles.error as any).data.errors;
        const errors = errorData.map((err: { field: any; message: any }) => ({
          name: err.field,
          errors: err.message,
        }));
        form.setFields(errors);
      } else {
        const errorMessage = roles.error as { data?: { message?: string } };
        MessageHandler().error(errorMessage.data?.message ?? "");
      }
    }
  }, [roles.error]);

  return (
    <LayoutUserManagement
      titlePage={tPage("title")}
      locationUrlList={LOCATION_BREADCRUMBS}
      backUrl={ROUTE.USER_MANAGEMENT.ROLES}
    >
      <Form
        form={form}
        layout="vertical"
        disabled={loading[roleTypes.CREATE_ROLE]}
        style={{ marginTop: "20px" }}
        requiredMark={undefined}
      >
        {/* {Search Input Card} */}
        <Card
          title={tPage("card.title")}
          className={styles["ant-card-base-custom"]}
        >
          <Row>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={tForm("role_name.name")}
                rules={[
                  { required: true, message: tForm("role_name.helperText") },
                  { max: 50, message: tForm("role_name.rule.invalidMax") },
                ]}
                name="roleName"
              >
                <Input
                  id="role-name"
                  placeholder={tForm("role_name.placeholder")}
                  className={styles["custom-input"]}
                  showCount
                  maxLength={50}
                  // onInput={(e: any) => {
                  //   e.target.value = e.target.value.toUpperCase();
                  // }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* {Button Actions} */}
        <FormActions>
          <Row justify="end" gutter={[8, 8]}>
            <Col>
              <Button
                id="cancel"
                className="ant-btn-custom secondary"
                onClick={onGoBack}
                disabled={loading[roleTypes.CREATE_ROLE]}
              >
                {tPage("actionButton.cancelText")}
              </Button>
            </Col>

            <Col>
              <Button
                id="save"
                className="ant-btn-custom primary"
                type="primary"
                onClick={handleCreateRole}
                htmlType="submit"
                loading={loading[roleTypes.CREATE_ROLE]}
              >
                {tPage("actionButton.saveText")}
              </Button>
            </Col>
          </Row>
        </FormActions>
      </Form>
    </LayoutUserManagement>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  roles: state.roles,
});

const mapDispatchToProps = {
  createNewRole: roleActions.createNewRoleFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddRole);
