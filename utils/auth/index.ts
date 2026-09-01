import { API_STATUS_CODE } from "../constants/response-api";

export const validateCreatePassword = (_: any, value: string) => {
  const passwordReg =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\W_])[^\s]{8,}$/;
  if (value) {
    if (value.match(passwordReg)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(
        "Password must be at least 8 alphanumeric characters with capital letter, number and special character",
      ),
    );
  }
  return Promise.reject(new Error(""));
};

export const isObjectEmpty = (obj: object): boolean =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

export const checkVerificationResponse = (code: any) => {
  switch (code) {
    case API_STATUS_CODE.USER_VERIFICATION.INVALID_TOKEN:
      return "not valid";
    case API_STATUS_CODE.USER_VERIFICATION.EXPIRED_TOKEN:
    case API_STATUS_CODE.USER_VERIFICATION.EXPIRED:
      return "expired";
    case API_STATUS_CODE.USER_VERIFICATION.INACTIVE_TOKEN:
      return "inactive";
    default:
      return "";
  }
};
