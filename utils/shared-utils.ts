import { NextRouter } from "next/router";
import { signOut } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

import UserApi from "../libraries/api/auth";
// import { encryptData } from "./encryptor";

const SharedUtils = () => {
  const clearSession = async (loginProvider?: string) => {
    if (
      loginProvider === "credentials-local" ||
      loginProvider === "credentials"
    ) {
      await signOut({ redirect: false });
    } else {
      await signOut();
    }
    // clear local storage
    localStorage.removeItem("accessMenus");
  };

  const logout = (loginProvider?: string) =>
    new Promise((resolve, reject) => {
      UserApi()
        .logoutUser()
        .then(async (response) => {
          await clearSession(loginProvider);
          resolve(response);
        })
        .catch(async (error) => {
          await clearSession(loginProvider);
          reject(error);
        });
    });

  function changeActiveTabKey(
    tabKey: string,
    setActiveTab: Dispatch<SetStateAction<string>>,
    router: NextRouter,
  ) {
    setActiveTab(tabKey);

    const _query = { ...router.query };
    delete _query.activeSection;

    router.replace({ query: { ..._query, activeKey: tabKey } }, undefined, {
      shallow: true,
    });
  }

  function changeActiveSectionKey(sectionKey: string, router: NextRouter) {
    const _query = { ...router.query };

    if (sectionKey) _query.activeSection = sectionKey;
    else delete _query.activeSection;

    router.replace({ query: _query }, undefined, { shallow: true });
  }

  const switchRole = (roleId: string) =>
    new Promise((resolve, reject) => {
      UserApi()
        .switchRole(roleId)
        .then(async (response) => {
          // change localstorage
          localStorage.removeItem("accessMenus");
          resolve(response);
        })
        .catch(async (error) => {
          reject(error);
        });
    });

  const switchCustomer = (customerId: string) =>
    new Promise((resolve, reject) => {
      UserApi()
        .switchCustomer(customerId)
        .then(async (response) => {
          localStorage.removeItem("accessMenus");
          resolve(response);
        })
        .catch(async (error) => {
          reject(error);
        });
    });

  return {
    clearSession,
    logout,
    changeActiveTabKey,
    changeActiveSectionKey,
    switchRole,
    switchCustomer,
  };
};

export default SharedUtils;
