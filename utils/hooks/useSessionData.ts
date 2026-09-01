import { useSession } from "next-auth/react";

export const useSessionDataUser = () => {
  const { data } = useSession() as any;
  const { isInternal = false, ...dataUser } = data?.detail?.data?.user || {};
  return { ...dataUser, isInternal: !!isInternal };
};
