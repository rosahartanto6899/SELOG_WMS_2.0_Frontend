import { useSession } from "next-auth/react";

import { User } from "../../types/glitchtip.type";

const useUserSession = (): User => {
  const { data } = useSession() as any;
  if (data) {
    const { user } = data.detail.data;
    return user;
  }
  return {};
};

export default useUserSession;
