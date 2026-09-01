import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { PayloadDetails } from "@sera-types/shipment-details.type";

const shipmentDetailsApi = () => {
  const baseUrlPath = `pod`;
  async function getDetails({ id }: PayloadDetails) {
    const url = `${apiUrl.billing}/${baseUrlPath}/${id}/shipment-detail`;
    return httpService.get(url).then((e) => e);
  }
  return { getDetails };
};

export default shipmentDetailsApi;
