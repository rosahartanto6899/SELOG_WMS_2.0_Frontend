/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import FormActions from "@sera-components/hocs/form-actions";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import MessageHandler from "@sera-libraries/message-handler";
import { menuActions, RootState } from "@sera-redux";
import { Menus, MenuState } from "@sera-types/menu.type";
import Utils from "@sera-utils/utils";
import { Col, Form, FormInstance, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface ActionFormProps {
  form: FormInstance;
  loading: boolean;
  menus: MenuState;
  getDropdownParentMenus: typeof menuActions.getDropdownParentMenusFetch;
  onSubmit: () => void;
}

const ActionForm = ({
  form,
  loading,
  menus,
  getDropdownParentMenus,
  onSubmit,
}: ActionFormProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, {
    keyPrefix: "menuConfiguration.form",
  });

  const [dataDropdown, setDataDropdown] = useState<Menus[]>([]);

  const onGoBack = () => {
    Utils().onGoBack(router, "/user-management/menu-configuration");
  };

  const searchParentMenu = (keyword?: string) => {
    if (keyword) {
      const filteredParentMenu = menus.dropdownParentMenus.data.filter(
        (dataMenu) =>
          dataMenu.menuName &&
          dataMenu.menuName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1,
      );
      setDataDropdown(filteredParentMenu);
    } else {
      setDataDropdown(menus.dropdownParentMenus.data);
    }
  };

  useEffect(() => {
    getDropdownParentMenus();
  }, []);

  useEffect(() => {
    const options: Menus[] = [];
    // LEVEL 1
    menus.dropdownParentMenus.data.forEach((option) => {
      options.push(option);
      // LEVEL 2
      if (option.children && option.children.length > 0) {
        option.children.forEach((optionLevel2) => {
          options.push({
            ...optionLevel2,
            menuName: ` -- ${optionLevel2.menuName}`,
          });
        });
      }
    });

    setDataDropdown(options);
  }, [menus.dropdownParentMenus.data]);

  useEffect(() => {
    if (menus.menuDetail.data) {
      form.setFieldValue("menuName", menus.menuDetail.data.menuName);
      form.setFieldValue("parentId", menus.menuDetail.data.parentId);
      form.setFieldValue("menuIcon", menus.menuDetail.data.menuIcon);
      form.setFieldValue("menuLink", menus.menuDetail.data.menuLink);
      form.setFieldValue("menuOrder", menus.menuDetail.data.menuOrder);
    }
  }, [menus.menuDetail.data]);

  useEffect(() => {
    if (menus.error) {
      if ((menus.error as any)?.data?.errors) {
        const errorData = (menus.error as any).data.errors;
        const errors = errorData.map((err: { field: any; message: any }) => ({
          name: err.field,
          errors: err.message,
        }));
        form.setFields(errors);
      } else {
        const errorMessage = menus.error as { data?: { message?: string } };
        MessageHandler().error(errorMessage.data?.message ?? "");
      }
    }
  }, [menus.error]);

  return (
    <Form form={form} layout="vertical" disabled={loading}>
      <Card
        title={
          Object.entries(menus?.menuDetail?.data)?.length > 0
            ? t("title.edit")
            : t("title.add")
        }
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="menuName"
              label={t("name.label")}
              rules={[{ required: true, message: t("name.required") }]}
              required
            >
              <Input
                id="menuName"
                placeholder={t("name.placeholder")}
                showCount
                maxLength={50}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item label={t("configuration.label")} name="parentId">
              <Select
                id="menu-configuration"
                placeholder={t("configuration.placeholder")}
                filterOption={false}
                loading={loading}
                onClear={() => searchParentMenu()}
                onSearch={(search) => searchParentMenu(search)}
              >
                {dataDropdown.map(({ id, menuName }) => (
                  <Select.Option value={id} key={id}>
                    {menuName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item name="menuIcon" label={t("icon.label")}>
              <Input
                id="menuIcon"
                placeholder={t("icon.placeholder")}
                showCount
                maxLength={50}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="menuLink"
              label={t("link.label")}
              rules={[{ required: true, message: t("name.required") }]}
              required
            >
              <Input
                id="menuLink"
                placeholder={t("link.placeholder")}
                showCount
                maxLength={50}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="menuOrder" label={t("order.label")}>
              <Input
                id="menuOrder"
                placeholder={t("order.placeholder")}
                type="number"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <FormActions>
        <Row justify="end" gutter={[8, 8]}>
          <Col>
            <Button
              id="cancel"
              className="ant-btn-custom secondary"
              onClick={onGoBack}
              disabled={loading}
            >
              {t("button.cancel")}
            </Button>
          </Col>

          <Col>
            <Button
              id="save"
              type="primary"
              htmlType="submit"
              className="ant-btn-custom primary"
              loading={loading}
              onClick={onSubmit}
            >
              {t("button.save")}
            </Button>
          </Col>
        </Row>
      </FormActions>
    </Form>
  );
};

const mapStateToProps = (state: RootState) => ({
  menus: state.menus,
});

const mapDispatchToProps = {
  getDropdownParentMenus: menuActions.getDropdownParentMenusFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionForm);
