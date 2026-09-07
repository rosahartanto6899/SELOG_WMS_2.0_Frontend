/* eslint-disable no-param-reassign */
import { Alert, message as UIMessage, Typography } from "antd";

import { API_STATUS_CODE } from "../../utils/constants/response-api";

const MESSAGES = {
  ERROR_500: "500: Server Errors.",
  ERROR_400: "400: Bad Request",
  ERROR_204: "204: No Content",
  ERROR_401: "401: Unauthorized",
  ERROR_429: "429: Too Many Requests.",
  ERROR_403: "403: Forbidden.",
  ERROR_404: "404: Not Found",
  ERROR_413: "413: File is too large",
  SOMETHING_WENT_WRONG: "Something went wrong!",
  SERVER_BUSY: "Server is busy, please try again.",
  DONT_HAVE_ACCESS: "You do not have access.",
};

const MessageHandler = () => {
  function getErrorMessage(error: any) {
    // ponytail: error bisa undefined — guard "in" operator
    if (error == null) return MESSAGES.SERVER_BUSY ?? "Something went wrong";
    if (
      ("code" in error && error.code === 500) ||
      ("status" in error && error.status === 500)
    ) {
      return `${MESSAGES.ERROR_500} ${MESSAGES.SERVER_BUSY}`;
    }
    if (
      ("code" in error && error.code === 403) ||
      ("status" in error && error.status === 403)
    ) {
      if (error?.error) {
        return error.error.message || error.error.description;
      }
      return error.description || error.message || MESSAGES.DONT_HAVE_ACCESS;
    }
    if (
      ("code" in error && error.code === 429) ||
      ("status" in error && error.status === 429)
    ) {
      return `${error.error.message || MESSAGES.ERROR_429} ${MESSAGES.SERVER_BUSY}`;
    }
    if (
      ("code" in error && error.code === 400) ||
      ("status" in error && error.status === 400) ||
      ("resultCode" in error && error.status === 400)
    ) {
      if (error?.error) {
        return error.error.message || error.error.description;
      }
      return (
        error.description ||
        error.message ||
        error.data.error ||
        MESSAGES.ERROR_400
      );
    }
    if (
      ("code" in error && error.code === 404) ||
      ("status" in error && error.status === 404) ||
      ("statusCode" in error && error.status === 404)
    ) {
      if (error?.error) {
        return error.error.message || error.error.description;
      }
      return error.message || MESSAGES.ERROR_404;
    }
    if (
      ("code" in error && error.code === 413) ||
      ("status" in error && error.status === 413) ||
      error?.toString().includes("Payload Too Large")
    ) {
      return MESSAGES.ERROR_413;
    }
    if ("message" in error && "statusCode" in error) {
      return `${error.statusCode}: ${error.message}`;
    }
    return error;
  }

  function success(m: string | { title?: string; content: string }) {
    if (typeof m === "object") {
      UIMessage.open({
        className: "sera-message",
        content: (
          <Alert
            message={
              <>
                {m.title && (
                  <Typography.Text strong>{m.title}&nbsp;</Typography.Text>
                )}
                <Typography.Text>
                  <span dangerouslySetInnerHTML={{ __html: m.content }} />
                </Typography.Text>
              </>
            }
            type="success"
            showIcon
          />
        ),
      });
    } else {
      UIMessage.success(m);
    }
  }

  function error(m: string | { title?: string; content: string }) {
    if (typeof m === "object") {
      UIMessage.open({
        className: "sera-message",
        content: (
          <Alert
            message={
              <>
                {m.title && (
                  <Typography.Text strong>{m.title}&nbsp;</Typography.Text>
                )}
                <Typography.Text>{m.content}</Typography.Text>
              </>
            }
            type="error"
            showIcon
          />
        ),
      });
    } else if (typeof m === "string" && m !== "") {
      UIMessage.error(m);
    }
  }

  function handleError(err: any, _message?: string) {
    const processedError = err;
    let message = _message;

    // ponytail: err bisa undefined (network error / reject tanpa payload) —
    // guard dulu, dulu crash "Cannot use 'in' operator ... in undefined"
    const e: any = err ?? {};

    if (e.data) {
      if (!e.data.message) {
        message = e.message;
      } else {
        message = e.data.message;
      }
    } else {
      message = e.message ?? _message;
    }

    if (message) {
      if (
        e.data?.code !== API_STATUS_CODE.AUTH.VALIDATION_ERROR &&
        e.data?.code !== API_STATUS_CODE.AUTH.INTERNAL_USER &&
        e.data?.code !== API_STATUS_CODE.AUTH.INVALID_TOKEN &&
        // e.data?.code !== API_STATUS_CODE.USER.BAD_REQUEST &&
        e.data?.code !== API_STATUS_CODE.MASTER_REPORT_MAPPING.NOT_FOUND &&
        e.data?.code !== API_STATUS_CODE.USER_VERIFICATION.EXPIRED_TOKEN &&
        e.data?.code !== API_STATUS_CODE.LOGOUT.MULTIPLE_DEVICE &&
        e.data?.code !== API_STATUS_CODE.LOGOUT.CHANGE_ROLE &&
        e.data?.code !== API_STATUS_CODE.LOGOUT.UPDATE_USER &&
        e.data?.code !== API_STATUS_CODE.LOGOUT.DELETE_USER &&
        // e.data?.code !== API_STATUS_CODE.POI.DUPLICATE &&
        e.data?.code !== API_STATUS_CODE.MASTER_DEVICE.DUPLICATE &&
        e.data?.code !== API_STATUS_CODE.MASTER_DRIVER.VALIDATION_ERROR &&
        e.data?.code !== API_STATUS_CODE.MASTER_VEHICLE.VALIDATION_ERROR &&
        e.data?.code !== API_STATUS_CODE.MASTER_DEVICE.VALIDATION_ERROR &&
        e.data?.code !== API_STATUS_CODE.POI.VALIDATION_ERROR &&
        e.status !== 500
      ) {
        error({ content: message });
      }
    } else if (![502, 503].includes(e.status))
      error({ content: getErrorMessage(processedError) });
  }

  return {
    getErrorMessage,
    success,
    error,
    handleError,
  };
};

export default MessageHandler;
