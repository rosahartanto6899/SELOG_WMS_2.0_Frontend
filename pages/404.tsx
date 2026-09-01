import Error404 from "@sera-components/error-boundary/Error404";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import GlitchTip from "../utils/glitchtip";

const NotFoundPage = () => {
  const { data } = useSession() as any;
  const { user } = data.detail.data;

  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      GlitchTip().setUserContext(user);
      GlitchTip().setApiContext({
        url: router.pathname,
      });
      GlitchTip().captureException("Error 404, Page Not Found");
    }
  }, []);

  return <Error404 />;
};
export default NotFoundPage;
