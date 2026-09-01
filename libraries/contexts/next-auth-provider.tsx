/* eslint-disable react/jsx-no-useless-fragment */
import LoadingPage from "@sera-components/loading/loading-page";
import UserApi from "@sera-libraries/api/auth";
// import { auth, db } from "@sera-libraries/firebase/config";
import { httpService } from "@sera-libraries/http-service";
import { CustomUseSession } from "@sera-types/auth.type";
import { encryptData } from "@sera-utils/encryptor";
import GlitchTip from "@sera-utils/glitchtip";
// import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import PermissionUtils from "@sera-utils/permission-utils";
import SharedUtils from "@sera-utils/shared-utils";
// import {
//   Auth,
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import { doc, getDoc, setDoc } from "firebase/firestore";
import _ from "lodash";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

type NextAuthProviderProps = {
  children: ReactNode;
};

const NextAuthProvider = (props: NextAuthProviderProps) => {
  const { children } = props;
  const router = useRouter();
  const { status } = useSession();
  const { data: session } = useSession() as CustomUseSession;
  const [isInstallSession, setIsInstallSession] = useState<boolean>(true);
  // const [isAuthFirebase, setIsAuthFirebase] = useState<boolean>(true);

  // const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
  //   useErrorHandler("/libraries/contexts/next-auth-provider.tsx");

  useEffect(() => {
    if (session?.detail?.data) {
      const { user } = session.detail.data;
      GlitchTip().setUser(user);
    }
  }, [session]);

  useEffect(() => {
    if (session?.detail?.data?.accessToken) {
      httpService.setDefaultToken(session.detail.data.accessToken);
      setIsInstallSession(false);

      if (typeof window !== "undefined") {
        const accessMenusOnLocalStorage = PermissionUtils().getAccessMenus();

        if (!accessMenusOnLocalStorage) {
          const fetchMasterMenu = async () => {
            const { user } = session.detail.data;
            const accessMenus = await UserApi().retrieveMenuAccessByUser(
              session?.detail?.data?.accessToken,
            );
            const accessMenusFix = {
              ...accessMenus.data,
              user_id: user.id,
              role_id: user.role,
            };
            const encryptedAccessMenus = encryptData(accessMenusFix);

            localStorage.setItem(
              "accessMenus",
              encryptedAccessMenus.toString(),
            );
          };
          fetchMasterMenu();
        }
      }
    }
  }, [session]);

  const checkUserSession = async () => {
    const accessMenus: any = PermissionUtils().getAccessMenus();
    if (accessMenus && session?.detail?.data) {
      const { user } = session.detail.data;
      const userId = user.id;
      const roleId = user.role;

      if (accessMenus.user_id !== userId || accessMenus.role_id !== roleId) {
        router.replace("/auth");
        await SharedUtils().logout(session?.loginProvider);
        const baseUrl = process.env.NEXTAUTH_URL ?? window.location.origin;
        setTimeout(() => {
          window.location.replace(`${baseUrl}/auth`);
          router.reload();
        }, 500);

        return false;
      }
    }
    return true;
  };

  const checkAccessExceptRead = async (splitPath: any, page: any) => {
    const getPoint = _.indexOf(splitPath, page);
    let mainPath = _.slice(splitPath, 0, getPoint)?.join("/");
    if (splitPath.includes("sourcing")) {
      mainPath = _.slice(splitPath, 0, 2)?.join("/");
    }

    const isHaveAccess: any =
      PermissionUtils().getAccessMenuPermission(mainPath);
    const isCreate = isHaveAccess?.data?.isCreate;
    const isUpdate = isHaveAccess?.data?.isUpdate;
    const isRead = isHaveAccess?.data?.isRead;
    if (!isHaveAccess) {
      router.replace("/404");
      return;
    }

    if (isHaveAccess && ["upsert"].includes(page) && isCreate === false) {
      router.replace("/404");
      return;
    }

    if (isHaveAccess && ["add"].includes(page) && isCreate === false) {
      router.replace("/404");
      return;
    }
    if (isHaveAccess && ["edit"].includes(page)) {
      if (isUpdate === false) {
        router.replace("/404");
        return;
      }
    }

    if (isHaveAccess && page === "view" && isRead === false)
      router.replace("/404");
  };

  const checkAccessRead = (pathName: any) => {
    const isHaveAccess: any =
      PermissionUtils().getAccessMenuPermission(pathName);

    if (!isHaveAccess) {
      router.replace("/404");
    }
  };

  useEffect(() => {
    checkUserSession();
  }, [router]);

  useEffect(() => {
    const accessMenus = PermissionUtils().getAccessMenus();

    if (accessMenus) {
      const pathName = router.pathname;
      const splitPath = pathName.split("/");

      checkUserSession();

      // Skip permission check untuk homepage
      if (pathName === "/" || pathName === "/welcome") {
        return;
      }

      if (
        (splitPath.includes("branches") && splitPath.includes("[branchId]")) ||
        splitPath.includes("vendor-sourcing") ||
        splitPath.includes("vendor-order")
      ) {
        return;
      }

      if (splitPath.includes("add")) {
        checkAccessExceptRead(splitPath, "add");
      } else if (splitPath.includes("upsert")) {
        checkAccessExceptRead(splitPath, "upsert");
      } else if (splitPath.includes("edit")) {
        checkAccessExceptRead(splitPath, "edit");
      } else if (splitPath.includes("[id]")) {
        checkAccessExceptRead(splitPath, "view");
      } else {
        checkAccessRead(pathName);
      }
    }

    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status]);

  // const firebaseUserLogin = async (
  //   _auth: Auth,
  //   _email: string,
  //   _password: string,
  // ) => {
  //   await signInWithEmailAndPassword(_auth, _email, _password).catch((err) => {
  //     if (isApiResponse(err))
  //       sendErrorHandlerApi("firebaseUserLogin", 185, err);
  //     else sendErrorHandler("firebaseUserLogin", 185, err);
  //   });
  // };

  // useEffect(() => {
  //   onAuthStateChanged(auth, async (user) => {
  //     if (user) setIsAuthFirebase(true);
  //     if (user || !session?.detail?.data?.user) return;

  //     const { email, id } = session.detail.data.user;
  //     const userDoc = doc(db, "users", id);
  //     const userSnap = await getDoc(userDoc);

  //     if (userSnap.exists()) {
  //       firebaseUserLogin(auth, email, id);
  //       return;
  //     }

  //     await setDoc(userDoc, { email }).catch((err) => {
  //       if (isApiResponse(err)) sendErrorHandlerApi("useEffect", 205, err);
  //       else sendErrorHandler("useEffect", 205, err);
  //     });

  //     await createUserWithEmailAndPassword(auth, email, id)
  //       .then(async () => firebaseUserLogin(auth, email, id))
  //       .catch((err) => {
  //         if (isApiResponse(err)) sendErrorHandlerApi("useEffect", 210, err);
  //         else sendErrorHandler("useEffect", 210, err);
  //       });
  //   });
  // }, [session]);

  if (
    status === "authenticated" &&
    !isInstallSession
    // && isAuthFirebase
  ) {
    return <>{children}</>;
  }

  return <LoadingPage />;
};

export default NextAuthProvider;

export const NextAuthProviderUnprotected = (props: NextAuthProviderProps) => {
  const { children } = props;
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status]);

  if (status !== "authenticated") {
    return <>{children}</>;
  }

  return <LoadingPage />;
};
