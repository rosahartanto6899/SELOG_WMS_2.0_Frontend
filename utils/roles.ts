import { useSession } from "next-auth/react";

import { CustomUseSession } from "../types/auth.type";
import { decryptData } from "./encryptor";

const Roles = () => {
  const { data: session } = useSession() as any | CustomUseSession;

  function isSuperAdmin() {
    return (
      `${session.detail.data.user.role}` ===
      decryptData(process.env.ROLE_ID_SUPER_ADMINISTRATOR)
    );
  }

  function isAdmin() {
    return (
      `${session.detail.data.user.role}` ===
      decryptData(process.env.ROLE_ID_ADMINISTRATOR)
    );
  }

  return {
    isSuperAdmin,
    isAdmin,
  };
};

export default Roles;
