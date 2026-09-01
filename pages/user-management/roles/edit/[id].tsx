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
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import styles from "./edit-role.module.scss";

interface EditRoleProps {
  roles: RoleState;
  loading: LoadingState;
  getRoleDetail: typeof roleActions.getRoleDetailFetch;
  updateRole: typeof roleActions.updateRoleFetch;
}

const EditRole: NextAppPage<EditRoleProps> = (props: EditRoleProps) => {
  const { roles, loading, getRoleDetail, updateRole } = props;

  const { t: tPage } = useTranslation(undefined, { keyPrefix: "roles.edit" });
  const { t: tForm } = useTranslation(undefined, { keyPrefix: "roles.form" });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/user-management/roles/edit/[id]");

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
  const { id } = router.query;

  const handleUpdateRole = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          id,
          roleName: values.roleName,
        };

        try {
          updateRole(formData);
        } catch (err) {
          if (isApiResponse(err))
            sendErrorHandlerApi("handleUpdateRole", 47, err);
        }
      })
      .catch((err) => {
        const messageHandler = MessageHandler();
        // messageHandler.error({ content: tPage("alert") });

        if (isApiResponse(err))
          sendErrorHandlerApi(
            "handleUpdateRole",
            47,
            err,
            messageHandler.error,
          );
      });
  };

  useEffect(() => {
    if (id) {
      try {
        getRoleDetail({ id });
      } catch (err: any) {
        if (isApiResponse(err)) sendErrorHandlerApi("useEffect", 76, err);
        else sendErrorHandler("useEffect", 72, err?.data?.message);
      }
    }
    return () => {
      form.resetFields();
    };
  }, [id, getRoleDetail]);

  useEffect(() => {
    if (roles.roleDetail.data) {
      try {
        form.setFieldValue("roleName", roles.roleDetail.data.roleName);
      } catch (error: any) {
        if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 88, error);
        else sendErrorHandler("useEffect", 86, error?.data?.message);
      }
    }
  }, [form, roles.roleDetail.data]);

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

  const onGoBack = () => {
    Utils().onGoBack(router, ROUTE.USER_MANAGEMENT.ROLES);
  };

  return (
    <LayoutUserManagement
      locationUrlList={LOCATION_BREADCRUMBS}
      titlePage={tPage("title")}
      backUrl={ROUTE.USER_MANAGEMENT.ROLES}
    >
      <Form
        form={form}
        layout="vertical"
        disabled={
          loading[roleTypes.GET_ROLE_DETAIL] || loading[roleTypes.UPDATE_ROLE]
        }
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
              >
                {tPage("actionButton.cancelText")}
              </Button>
            </Col>

            <Col>
              <Button
                id="save"
                className="ant-btn-custom primary"
                type="primary"
                onClick={handleUpdateRole}
                htmlType="submit"
                loading={loading[roleTypes.UPDATE_ROLE]}
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
  roles: state.roles,
  loading: state.loading,
});

const mapDispatchToProps = {
  getRoleDetail: roleActions.getRoleDetailFetch,
  updateRole: roleActions.updateRoleFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditRole);
