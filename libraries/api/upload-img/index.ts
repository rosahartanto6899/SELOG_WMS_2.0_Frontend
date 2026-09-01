import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";

export const UploadImageApi = () => {
  // Get Key for Encrypt Image
  async function retrieveKeyEncrypt() {
    return httpService
      .get(`${apiUrl.image}/key/generate`)
      .then((resp) => resp)
      .catch((err) => err);
  }

  async function postImage(payload: { data: string }, key: string) {
    return httpService
      .post(`${apiUrl.image}/image/upload`, payload, { headers: { key } })
      .then((resp) => resp);
  }

  async function getImage(key: string) {
    return httpService
      .get(`${apiUrl.image}/image/me`, { headers: { key } })
      .then((resp) => resp);
  }

  // Get Key for Encrypt Image
  async function retrieveKeyEncryptServer(token: string) {
    return httpService
      .get(`${apiUrl.image}/key/generate`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => resp)
      .catch((err) => err);
  }

  return {
    retrieveKeyEncrypt,
    postImage,
    getImage,
    retrieveKeyEncryptServer,
  };
};
