import { decryptData } from "@sera-utils/encryptor";

const apiUrl = {
  base: decryptData(process.env.API_BASE_URL),
  user: decryptData(process.env.SERVICE_USER),
  master: decryptData(process.env.SERVICE_MASTER),
  vehicle: decryptData(process.env.SERVICE_VEHICLE),
  incoming: decryptData(process.env.SERVICE_INCOMING),
  export: "",
  image: "",
};

export default apiUrl;
