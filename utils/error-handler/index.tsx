/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Sentry from "@sentry/nextjs";
import MessageHandler from "@sera-libraries/message-handler";
import { FormInstance } from "antd";
import { AxiosError } from "axios";
import { isEmpty } from "lodash";

import { HTTP_STATUS_CODES } from "./common";
import { ApiErrorAxios, GetErrorApiResponse, SentryOptions } from "./types";

export const getErrorApiResponse = (error: any): GetErrorApiResponse | any => {
  const { config = {}, status, statusText } = error;
  const { baseURL, params = {}, url } = config;

  const errorMsg = HTTP_STATUS_CODES.filter(({ code }) => code === status).map(
    ({ message }) => message,
  );
  if (status && statusText)
    return {
      message: errorMsg.length > 0 ? errorMsg[0] : statusText,
      params,
      statusText,
      url: `${baseURL}${url}`,
    };
  return error;
};

export const sendCapturedSentry = ({
  apiContext,
  errorContext,
  message,
  user = {},
}: SentryOptions) => {
  Sentry.setContext("User", { ...user });
  if (apiContext) Sentry.setContext("API Context", { ...apiContext });

  if (errorContext) Sentry.setContext("Error Context", { ...errorContext });
  Sentry.captureException(new Error(message));
};

export const setFormErrorHandle = (form: FormInstance, _error: any): void => {
  if (isEmpty(_error)) return;

  try {
    const errorData = _error?.data?.errors || _error?.errors || [];

    if (Array.isArray(errorData) && errorData.length > 0) {
      const errors = errorData.map(
        (_err: { field: string; message: string | string[] }) => {
          const _path = _err.field
            .split(".")
            .map((_part) => (isNaN(Number(_part)) ? _part : Number(_part)));

          return {
            name: _path,
            errors: Array.isArray(_err.message) ? _err.message : [_err.message],
          };
        },
      );

      form.setFields(errors);
    }
  } catch (error) {
    MessageHandler().error(JSON.stringify(error));
  }
};

export const captureErrorAxios = (
  error: unknown,
  isApiResponse?: boolean,
  sendErrorHandlerApi?: (
    functionName: string,
    rowNumber: number,
    error: any,
    errorMessageHandler?: any,
  ) => void,
  sendErrorHandler?: (
    functionName: string,
    rowNumber: number,
    message: string,
    errorMessageHandler?: any,
  ) => void,
) => {
  const err = { response: error } as AxiosError<ApiErrorAxios>;
  const errors = err.response?.data?.errors;
  const errMsg = err?.response?.data?.message;
  const errorMsg = error as { message: string };

  if (isApiResponse) {
    sendErrorHandlerApi?.("useEffect", 101, error);
  } else {
    sendErrorHandler?.("useEffect", 100, errorMsg.message || err.message);
  }

  if (Array.isArray(errors)) {
    for (const error of errors) {
      if (Array.isArray(error.message)) {
        MessageHandler().error({
          title: error.message[0] as string,
          content: "",
        });
      } else {
        MessageHandler().error({ title: error.message, content: "" });
      }
    }
    return;
  }

  if (errMsg) {
    MessageHandler().error(errMsg);
  } else if (!errMsg) {
    MessageHandler().error("Someting went wrong, please try again.");
  }
};
