// const RefreshTokenHandler = (props: any) => {
//   const { setInterval } = props;
//   const { data: session } = useSession() as any;
//   const { isApiResponse, sendErrorHandler, sendErrorHandlerApi } = useErrorHandler(
//     'libraries/refresh-token-handler/refresh-token-handler'
//   );

//   const validate = async (id: string) => {
//     let valid = false;
//     try {
//       const response: AxiosResponse = await UserApi().retrieveUserDetail({ id });
//       if (response.status === 200) valid = true;
//     } catch (e: any) {
//       if (isApiResponse(e)) sendErrorHandlerApi('validate', 381, e);
//       else sendErrorHandler('validate', 382, e?.data?.message);
//       const error = e as AxiosError;
//       if (error.status === 401) valid = false;
//       else valid = true;
//     }
//     return valid;
//   };

import { useSession } from "next-auth/react";
import { useEffect } from "react";

const RefreshTokenHandler = (props: any) => {
  const { setInterval } = props;
  const { data: session } = useSession() as any;

  useEffect(() => {
    if (session) {
      // We did set the token to be ready to refresh after 23 hours, here we set interval of 0 hours 55 minutes.
      const timeRemaining = Math.round(
        (session.accessTokenExpires - 5 * 60 * 1000 - Date.now()) / 1000,
      );
      setInterval(timeRemaining > 0 ? timeRemaining : 0);
    }
  }, [session]);

  return null;
};

export default RefreshTokenHandler;
