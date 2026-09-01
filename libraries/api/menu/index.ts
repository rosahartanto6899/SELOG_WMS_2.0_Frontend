import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { BaseType } from "@sera-types/base.type";
import { CreateNewMenuPayload, UpdateMenuPayload } from "@sera-types/menu.type";

const MenuApi = () => {
  async function retrieveMenus(payload: BaseType) {
    return httpService
      .get(`${apiUrl.user}/menus`, { params: payload })
      .then((resp) => resp);
  }

  async function retrieveMenuDetail(payload: { id: string }) {
    return httpService
      .get(`${apiUrl.user}/menus/${payload.id}`)
      .then((resp) => resp);
  }

  async function retrieveParentDropdownMenus() {
    return httpService
      .get(`${apiUrl.user}/menus/parent-dropdown`)
      .then((resp) => resp);
  }

  async function retrieveDropdownMenus() {
    return httpService
      .get(`${apiUrl.user}/menus/leaf-dropdown`)
      .then((resp) => resp);
  }

  async function createMenu(payload: CreateNewMenuPayload) {
    return httpService
      .post(`${apiUrl.user}/menus`, payload)
      .then((resp) => resp);
  }

  async function updateMenu(payload: {
    id: string;
    items?: UpdateMenuPayload;
  }) {
    const { items } = payload;
    const data = {
      menuOrder: items?.menuOrder,
      menuName: items?.menuName,
      parentId: items?.parentId,
      menuIcon: items?.menuIcon,
      menuLink: items?.menuLink,
    };
    return httpService
      .put(`${apiUrl.user}/menus/${payload.id}`, data)
      .then((resp) => resp);
  }

  async function deleteMenu(id: string) {
    return httpService.del(`${apiUrl.user}/menus/${id}`).then((resp) => resp);
  }

  return {
    retrieveMenus,
    retrieveMenuDetail,
    retrieveParentDropdownMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    retrieveDropdownMenus,
  };
};

export default MenuApi;
