/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import MenuConfigurationComponent from "@sera-components/pages/user-management/menu-configuration";
import { GetBreadcrumb } from "@sera-components/pages/user-management/menu-configuration/menu-configuration-props-header";
import MessageHandler from "@sera-libraries/message-handler";
import { menuActions, RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import { menuTypes } from "@sera-types/menu.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

export interface MenuConfigurationEditProps {
  loading: LoadingState;
  getMenuDetail: typeof menuActions.getMenuDetailFetch;
  updateMenu: typeof menuActions.updateMenuFetch;
}

const MenuConfigurationEdit = ({
  loading,
  getMenuDetail,
  updateMenu,
}: MenuConfigurationEditProps) => {
  const router = useRouter();
  const { t } = useTranslation(undefined, {
    keyPrefix: "menuConfiguration.edit",
  });
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/user-management/menu-configuration/edit/[id]");
  const [form] = Form.useForm();

  const { id } = router.query;

  const handleUpdateMenu = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          id,
          menuName: values.menuName,
          parentId: values.parentId,
          menuIcon: values.menuIcon,
          menuLink: values.menuLink,
          menuOrder: parseInt(values.menuOrder),
        };

        try {
          updateMenu(formData);
        } catch (err: any) {
          if (isApiResponse(err))
            sendErrorHandlerApi("handleUpdateMenu", 32, err);
          else sendErrorHandler("handleUpdateMenu", 32, err?.data?.message);
        }
      })
      .catch((err: any) => {
        const messageHandler = MessageHandler();

        if (isApiResponse(err))
          sendErrorHandlerApi(
            "handleUpdateMenu",
            32,
            err,
            messageHandler.error,
          );
      });
  };

  useEffect(() => {
    if (id) {
      try {
        getMenuDetail({ id });
      } catch (err: any) {
        if (isApiResponse(err)) sendErrorHandlerApi("useEffect", 60, err);
        else sendErrorHandler("useEffect", 60, err?.data?.message);
      }
    }
    return () => form.resetFields();
  }, [id]);

  return (
    <>
      <MenuConfigurationComponent.Header
        id="breadcrumb-menu-configuration-edit"
        breadcrumb={[...GetBreadcrumb(), { title: t("title") }]}
      />
      <MenuConfigurationComponent.Form
        loading={loading[menuTypes.CREATE_MENU]}
        form={form}
        onSubmit={handleUpdateMenu}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  getMenuDetail: menuActions.getMenuDetailFetch,
  updateMenu: menuActions.updateMenuFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuConfigurationEdit);
