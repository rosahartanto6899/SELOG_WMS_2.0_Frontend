// import { LatLngExpression } from 'leaflet';

export type AddressTypes =
  | "administrative_area_level_1"
  | "administrative_area_level_2"
  | "administrative_area_level_3"
  | "administrative_area_level_4"
  | "administrative_area_level_5"
  | "administrative_area_level_6"
  | "administrative_area_level_7"
  | "political"
  | "route"
  | "street_number"
  | "premise"
  | "subpremise"
  | "postal_code"
  | "country";

export interface Address {
  long_name: string;
  short_name: string;
  types: AddressTypes[];
}

export interface PopupData {
  // position: LatLngExpression;
  address: string;
  radius: number;
}

export type BaseMapType = "terrain.day" | "satellite.day" | "hybrid.day";
