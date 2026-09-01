import { useRouter } from "next/router";

import { User } from "../../types/glitchtip.type";
import { getErrorApiResponse, sendCapturedSentry } from "../error-handler";
import { ApiContextProps, ErrorContextProps } from "../error-handler/types";
import useUserSession from "./useUserSession";

const useErrorHandler = (fileName: string) => {
  const user: User = useUserSession();

  const router = useRouter();
  const isApiResponse = (error: any) => !!error.status && !!error.statusText;
  const sendErrorHandler = (
    functionName: string,
    rowNumber: number,
    message: string,
    errorMessageHandler?: any,
  ) => {
    const errorContext: ErrorContextProps = {
      fileName,
      functionName,
      pageUrl: router.pathname,
      rowNumber,
    };
    if (errorMessageHandler) errorMessageHandler(message);
    sendCapturedSentry({
      errorContext,
      message: `[${message}] ${fileName}: ${functionName}`,
      user,
    });
  };
  const sendErrorHandlerApi = (
    functionName: string,
    rowNumber: number,
    error: any,
    errorMessageHandler?: any,
  ) => {
    const { message, statusText, url } = getErrorApiResponse(error);
    const apiContext: ApiContextProps = {
      apiUrl: url,
      fileName,
      functionName,
      pageUrl: router.pathname,
      rowNumber,
    };
    if (errorMessageHandler) errorMessageHandler(message ?? error);
    sendCapturedSentry({
      apiContext,
      message: `[${statusText}] ${fileName}: ${functionName}`,
      user,
    });
  };
  return {
    isApiResponse,
    sendErrorHandler,
    sendErrorHandlerApi,
  };
};

export default useErrorHandler;
