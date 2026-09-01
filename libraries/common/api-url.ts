import { decryptData } from "@sera-utils/encryptor";

const apiUrl = {
  base: decryptData(process.env.API_BASE_URL),
  user: decryptData(process.env.SERVICE_USER),
  master: decryptData(process.env.SERVICE_MASTER),
  order: decryptData(process.env.SERVICE_ORDER),
  vehicle: decryptData(process.env.SERVICE_VEHICLE),
  driver: decryptData(process.env.SERVICE_DRIVER),
  journey: decryptData(process.env.SERVICE_JOURNEY),
  billing: decryptData(process.env.SERVICE_BILLING),
  export: "",
  image: "",
};

export default apiUrl;
