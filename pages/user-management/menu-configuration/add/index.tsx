/* eslint-disable @typescript-eslint/no-explicit-any */
import MenuConfigurationComponent from "@sera-components/pages/user-management/menu-configuration";
import { GetBreadcrumb } from "@sera-components/pages/user-management/menu-configuration/menu-configuration-props-header";
import MessageHandler from "@sera-libraries/message-handler";
import { menuActions, RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { menuTypes } from "@sera-types/menu.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

export interface MenuConfigurationAddProps {
  loading: LoadingState;
  createNewMenu: typeof menuActions.createNewMenuFetch;
}

const MenuConfigurationAdd = ({
  loading,
  createNewMenu,
}: MenuConfigurationAddProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "menuConfiguration.add",
  });
  const [form] = Form.useForm();

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/user-management/menu-configuration/add/index");

  const handleCreateMenu = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          menuName: values.menuName,
          parentId: values.parentId,
          menuIcon: values.menuIcon,
          menuLink: values.menuLink,
          menuOrder: parseInt(values.menuOrder),
        };

        try {
          createNewMenu(formData);
        } catch (err: any) {
          if (isApiResponse(err))
            sendErrorHandlerApi("handleCreateMenu", 26, err);
          else sendErrorHandler("handleCreateMenu", 26, err?.data?.message);
        }
      })
      .catch((err: any) => {
        const messageHandler = MessageHandler();

        if (isApiResponse(err))
          sendErrorHandlerApi(
            "handleCreateMenu",
            26,
            err,
            messageHandler.error,
          );
      });
  };

  return (
    <>
      <MenuConfigurationComponent.Header
        id="breadcrumb-menu-configuration-add"
        breadcrumb={[...GetBreadcrumb(), { title: t("title") }]}
      />
      <MenuConfigurationComponent.Form
        loading={loading[menuTypes.CREATE_MENU]}
        form={form}
        onSubmit={handleCreateMenu}
      />
    </>
  );
};
const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  menus: state.menus,
});

const mapDispatchToProps = {
  createNewMenu: menuActions.createNewMenuFetch,
  getDropdownParentMenus: menuActions.getDropdownParentMenusFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuConfigurationAdd);
