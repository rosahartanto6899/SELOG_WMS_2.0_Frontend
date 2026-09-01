import { ShipmentDetailForm } from "@sera-components/shipment-detail-form";
import React from "react";

const ShipmentDetail = ({ id }: { id: string }) => {
  return <ShipmentDetailForm id={id} />;
};

export default ShipmentDetail;
