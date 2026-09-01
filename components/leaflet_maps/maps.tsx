// src/components/Map.tsx
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import LoadingPage from "@sera-components/loading/loading-page";
import TypographyText from "@sera-components/typography/typography-text";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import { isNil } from "lodash";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

interface IProps {
  height?: number | string;
  latitude?: number;
  longitude?: number;
  address?: string;
  customIcon?: string;
  defaultIcon?: boolean;
  loading?: boolean;
  rotation?: number;
}

const Maps = (props: IProps) => {
  const {
    height,
    latitude,
    longitude,
    address,
    customIcon,
    defaultIcon = true,
    loading,
    rotation = 0,
  } = props;
  const latLng: LatLngExpression = [latitude ?? 0, longitude ?? 0];

  const icon = customIcon ? customIcon : "/icons/logis-truck.png";

  // const markerIcon = L.icon({
  //   iconUrl: icon,
  //   iconSize: [15, 45],
  //   iconAnchor: [7.5, 45],
  // });

  const markerIcon = L.divIcon({
    className: "",
    html: `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      transform: translateX(-50%);
      white-space: nowrap;
      
    ">
      <img 
        src="${icon}" 
        style="
          width: 15px; 
          height: 45px; 
          transform: rotate(${rotation}deg);
          transform-origin: center center;
        "
      />
    </div>`,
    iconSize: [15, 45],
    iconAnchor: [7.5, 45],
  });

  if (loading) return <LoadingPage />;

  function ChangePosition({
    lat,
    lng,
  }: {
    lat: number | undefined;
    lng: number | undefined;
  }) {
    const map = useMap();

    useEffect(() => {
      if (lat !== 0 && lng !== 0 && !isNil(lat) && !isNil(lng)) {
        map.setView([lat, lng]);
      }
    }, [lat, lng, map]);

    return null;
  }

  return (
    <MapContainer
      style={{
        height: height ? height : "75vh",
        width: "100%",
      }}
      center={latLng}
      zoom={17}
      maxZoom={18}
      minZoom={5}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={18}
        minZoom={5}
      />
      <ChangePosition lat={latitude} lng={longitude} />

      <Marker position={latLng} {...(!defaultIcon && { icon: markerIcon })}>
        <Popup>
          <TypographyText strong>{address}</TypographyText>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Maps;
