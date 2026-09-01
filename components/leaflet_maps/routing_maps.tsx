import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// src/components/Map.tsx
import { MapContainer, TileLayer } from "react-leaflet";

const Routing = dynamic(
  () => import("@sera-components/leaflet_maps/routing-machine"),
  {
    loading: () => <p>A map is loading...</p>,
    ssr: false,
  },
);

const RoutingMaps = () => {
  const [map, setMap] = useState(null);
  const [isMapInit, setIsMapInit] = useState(false);

  useEffect(() => {
    setIsMapInit(true);
  }, [map]);

  const saveMap = (mapInstance: any) => {
    setMap(mapInstance);
  };

  return (
    <MapContainer
      style={{
        height: "75vh",
        width: "100%",
      }}
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
      ref={saveMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {isMapInit && <Routing map={map} />}
    </MapContainer>
  );
};

export default RoutingMaps;
