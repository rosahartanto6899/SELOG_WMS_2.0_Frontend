/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
// eslint-disable-next-line no-unused-vars
import MessageHandler from "@sera-libraries/message-handler";
import { decryptData } from "@sera-utils/encryptor";
import SharedUtils from "@sera-utils/shared-utils";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import { ErrorMessageHandler } from "../error";

/**
 * Handles axios http with interceptor
 *
 */
const baseURL: string = decryptData(process.env.API_BASE_URL);
// const ocpApimKey: string = decryptData(process.env.OCP_APIM_KEY);
const xApiKey: string = decryptData(process.env.X_API_KEY);

const HttpService = (url = baseURL) => {
  const retryDelay = 1000;
  const maxRetry = 3;
  let retryCount = maxRetry;
  const errorHandler = ErrorMessageHandler();
  const isServer = typeof window === "undefined";
  let isLoggingOut = false;
  // instantiate axios
  const _instance: AxiosInstance = axios.create({
    baseURL: url,
  });

  // _instance.defaults.headers.common["ocp-apim-subscription-key"] = ocpApimKey;
  _instance.defaults.headers.common["x-api-key"] = xApiKey;
  // _instance.defaults.headers.common["user-agent"] = !isServer
  //   ? navigator.userAgent
  //   : "";

  _instance.interceptors.response.use(
    // success response
    (response) => response,
    // error response
    (error) => handleResponse(error),
  );

  /**
   * Get the axios instance
   *
   * @returns { AxiosInstance } Returns the axios instance and use get, delete, post, put, and other methods.
   */
  function instance(): AxiosInstance {
    return _instance;
  }

  /**
   * Private method which handles retry mechanism
   *
   * @param   { number }    milliseconds    Contains the delay to execute the request again
   * @param   { Object }    error    Contains error object
   * @returns { Object } Promise either resolve or rejected
   */
  function retryRequest(milliseconds: number, error: any): object {
    return new Promise((resolve, reject) => {
      if (retryCount - 1 > 0) {
        setTimeout(() => resolve(_instance(error.config)), milliseconds);
        retryCount -= 1;
      } else {
        retryCount = maxRetry;
        if (!isServer) errorHandler.handleComponentBaseError(error.response);
        reject(error.response);
      }
    });
  }

  /**
   * Private method which handles error response and implement retry mechanism for 429 (cosmos rate limit) error
   *
   * @param   { Object }    error    Contains the error object
   * @returns { Object } Promise either resolve or rejected
   */
  function handleResponse(error: any): object {
    const status = error.status ?? error.response?.status ?? null;

    if (status === 429) {
      return retryRequest(retryDelay, error);
    }

    if (status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      if (typeof window !== "undefined") {
        const isEn = !!window.location.pathname
          .split("/")
          .filter((o) => o === "en").length;

        if (isEn) {
          MessageHandler().error(
            "Your session has expired. Please log in again.",
          );
        } else {
          MessageHandler().error(
            "Sesi Anda telah berakhir. Silakan login kembali",
          );
        }

        setTimeout(() => {
          (async () => {
            const baseUrl = process.env.NEXTAUTH_URL ?? window.location.origin;
            const authUrl = `${baseUrl}/auth`;
            await SharedUtils().clearSession();
            window.location.replace(authUrl);
          })();
        }, 1000);
      }
    }

    if (status === 422) {
      return Promise.reject(error.response);
    }

    if (!isServer && status !== 401) {
      errorHandler.handleComponentBaseError(error.response);
    }

    if (status === 500) {
      MessageHandler().error("Internal Server Error");
    }

    return Promise.reject(error.response);
  }
  /**
   * Public method which handles the default authorization header
   *
   * @param   { string }    token    Contains the token value
   */
  function setDefaultToken(token: string) {
    _instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  /**
   * Public method which handles the default userId header
   *
   * @param   { string } userId    Contains the userId value
   */
  function setDefaultUserId(userId: string) {
    _instance.defaults.headers.common.userId = userId;
  }

  /**
   * Public method which handles the default lang header
   *
   * @param   { string } lang      Contains the lang value
   */
  function setDefaultLang(lang: string) {
    _instance.defaults.headers.common.lang = lang;
  }

  function get(url: string, params?: AxiosRequestConfig) {
    return _instance.get(url, params);
  }

  function post(url: string, data?: any, config?: AxiosRequestConfig<any>) {
    return _instance.post(url, data, config);
  }

  function put(url: string, data?: any, config?: AxiosRequestConfig<any>) {
    return _instance.put(url, data, config);
  }

  function patch(url: string, data?: any, config?: AxiosRequestConfig<any>) {
    return _instance.patch(url, data, config);
  }

  function del(url: string, config?: AxiosRequestConfig<any>) {
    return _instance.delete(url, config);
  }

  return {
    instance,
    retryRequest,
    handleResponse,
    setDefaultToken,
    setDefaultUserId,
    setDefaultLang,
    get,
    post,
    put,
    patch,
    del,
  };
};

const httpService = HttpService();
export { httpService };
