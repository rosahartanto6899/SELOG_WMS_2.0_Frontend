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

declare module "axios" {
  export interface AxiosRequestConfig {
    /** true = caller menangani error sendiri (mis. ringkasan binning-all);
     *  interceptor TIDAK menampilkan toast global */
    skipGlobalError?: boolean;
  }
}
// const ocpApimKey: string = decryptData(process.env.OCP_APIM_KEY);
const xApiKey: string = decryptData(process.env.X_API_KEY);

const HttpService = (url = baseURL) => {
  const retryDelay = 1000;
  const maxRetry = 3;
  const requestTimeout = 5000;
  const retryJitter = 250;
  const retryableStatuses = [429, 502, 503, 504];
  const idempotentMethods = ["get", "head"];
  const errorHandler = ErrorMessageHandler();
  const isServer = typeof window === "undefined";
  let isLoggingOut = false;
  // instantiate axios
  const _instance: AxiosInstance = axios.create({
    baseURL: url,
    timeout: requestTimeout,
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
   * Private method which decides whether an error is a transient failure
   * that is safe to retry: only idempotent methods (GET/HEAD) and only
   * network error, request timeout (ECONNABORTED), or HTTP 429/502/503/504.
   * Mutations (POST/PUT/PATCH/DELETE) are never retried to avoid duplicate
   * operations.
   *
   * @param   { any }       error    Contains axios error object
   * @returns { boolean }   True when the request may be retried
   */
  function isRetryableError(error: any): boolean {
    const config = error?.config;
    if (!config) return false;

    const method = String(config.method ?? "").toLowerCase();
    if (!idempotentMethods.includes(method)) return false;

    if (error.code === "ECONNABORTED") return true; // request timeout

    const status = error.status ?? error.response?.status ?? null;
    // null status = network error (no response received)
    return status === null || retryableStatuses.includes(status);
  }

  /**
   * Private method which computes the retry delay. Honors the server's
   * Retry-After header when present, otherwise uses exponential backoff
   * (1s → 2s → 4s) plus random jitter to avoid synchronized retry storms.
   *
   * @param   { any }      error     Contains axios error object
   * @param   { number }   attempt   Current retry attempt (1-based)
   * @returns { number }   Delay in milliseconds before the next attempt
   */
  function getRetryDelay(error: any, attempt: number): number {
    const retryAfter = error?.response?.headers?.["retry-after"];
    const seconds = Number(retryAfter);
    // ponytail: numeric Retry-After only; HTTP-date form falls back to backoff
    if (retryAfter !== undefined && !Number.isNaN(seconds)) {
      return seconds * 1000;
    }
    return retryDelay * 2 ** (attempt - 1) + Math.random() * retryJitter;
  }

  /**
   * Private method which handles retry mechanism. Delay follows Retry-After
   * when provided by the server, otherwise exponential backoff with jitter
   * (1s → 2s → 4s, max 3 retries). The retry counter lives on error.config
   * so the budget is per-request, not shared between concurrent requests.
   *
   * @param   { Object }    error    Contains error object
   * @returns { Object } Promise either resolve or rejected
   */
  function retryRequest(error: any): Promise<any> {
    const config = error.config;
    config.__retryCount = (config.__retryCount ?? 0) + 1;

    return new Promise((resolve, reject) => {
      if (config.__retryCount <= maxRetry) {
        const delay = getRetryDelay(error, config.__retryCount);
        setTimeout(() => resolve(_instance(config)), delay);
      } else {
        // response bisa undefined (network error) — fallback ke error axios
        if (!isServer)
          errorHandler.handleComponentBaseError(error.response ?? error);
        reject(error.response ?? error);
      }
    });
  }

  /**
   * Private method which handles error response and implement retry
   * mechanism for transient failures (429 cosmos rate limit, 502/503/504,
   * network error, timeout) on idempotent requests only
   *
   * @param   { Object }    error    Contains the error object
   * @returns { Object } Promise either resolve or rejected
   */
  function handleResponse(error: any): object {
    const status = error.status ?? error.response?.status ?? null;

    if (isRetryableError(error)) {
      return retryRequest(error);
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

    if (!isServer && status !== 401 && !error?.config?.skipGlobalError) {
      // response bisa undefined (network error) — fallback ke error axios
      errorHandler.handleComponentBaseError(error.response ?? error);
    }

    if (status === 500) {
      MessageHandler().error("Internal Server Error");
    }

    return Promise.reject(error.response ?? error);
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
