import { decryptData } from "@sera-utils/encryptor";
import axios from "axios";

export interface PowerBIParams {
  accessToken: string;
  embedUrl: string;
  reportId: string;
  pageId?: string;
}

/**
 * Utility function to fetch PowerBI embed parameters
 * @param reportId - The PowerBI Report ID
 * @param pageId - Optional Page ID to navigate to specific page in the report
 * @returns PowerBIParams object or null if PowerBI is not configured
 */
export const getPowerBIEmbedParams = async (
  reportId: string,
  pageId: string = "",
): Promise<PowerBIParams | null> => {
  const powerBiApiUrl = decryptData(process.env.POWER_BI_API_URL as string);

  if (!powerBiApiUrl) {
    return null;
  }

  try {
    // Step 1: Authenticate to get access token
    const dataParamAuth = new URLSearchParams({
      grant_type: decryptData(process.env.POWER_BI_GRANT_TYPE as string),
      client_id: decryptData(process.env.POWER_BI_CLIENT_ID as string),
      client_secret: decryptData(process.env.POWER_BI_CLIENT_SECRET as string),
      resource: decryptData(process.env.POWER_BI_RESOURCE as string),
    }).toString();

    const loginUrl = decryptData(process.env.POWER_BI_LOGIN_URL as string);
    const tenantId = decryptData(process.env.POWER_BI_TENANT_ID as string);

    const configAuth = {
      method: "POST",
      url: `${loginUrl}/${tenantId}/oauth2/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: dataParamAuth,
    };

    const auth = await axios(configAuth);
    const dataAuth = auth.data;

    const groupId = decryptData(process.env.POWER_BI_GROUP_ID as string);

    // Step 2: Get embed URL and generate embed token
    const configEmbedURL = {
      method: "GET",
      url: `${powerBiApiUrl}/groups/${groupId}/reports/${reportId}`,
      headers: {
        Authorization: `Bearer ${dataAuth.access_token}`,
      },
    };

    const dataParamEmbedToken = JSON.stringify({
      accessLevel: "view",
      datasetId: decryptData(process.env.POWER_BI_DATASET_ID as string),
    });

    const configEmbedToken = {
      method: "POST",
      url: `${powerBiApiUrl}/groups/${groupId}/reports/${reportId}/GenerateToken`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dataAuth.access_token}`,
      },
      data: dataParamEmbedToken,
    };

    const [embedURL, embedToken] = await Promise.all([
      axios(configEmbedURL),
      axios(configEmbedToken),
    ]);

    const dataEmbedURL = embedURL.data;
    const dataEmbedToken = embedToken.data;

    return {
      accessToken: dataEmbedToken.token,
      embedUrl: dataEmbedURL.embedUrl,
      reportId,
      ...(pageId && { pageId }),
    };
  } catch (error) {
    console.error("Error fetching PowerBI embed params:", error);
    return null;
  }
};
