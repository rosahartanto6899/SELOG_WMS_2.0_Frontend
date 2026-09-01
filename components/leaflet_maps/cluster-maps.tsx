/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useRef, useState } from "react";

interface ClusterMapProps {
  locations: UnitPositionData[];
  onClick?: (_location: LocationData) => void;
}

export interface UnitPositionData {
  id?: string;
  latitude?: number;
  longitude?: number;
  licensePlate?: string;
}

export interface LocationData {
  latitude?: number;
  longitude?: number;
  data?: UnitPositionData[];
}

const CLUSTER = {
  C1: { size: 53, color: "#008cff" },
  C2: { size: 56, color: "#ffbf00" },
  C3: { size: 66, color: "#ff0000" },
  C4: { size: 78, color: "#ff00ed" },
  C5: { size: 90, color: "#b700ff" },
};

const RenderClusterMarker = (count: number) => {
  let _clusterArgs = CLUSTER.C5;
  if (count >= 2 && count <= 9) _clusterArgs = CLUSTER.C1;
  if (count >= 10 && count <= 99) _clusterArgs = CLUSTER.C2;
  if (count >= 100 && count <= 999) _clusterArgs = CLUSTER.C3;
  if (count >= 1000 && count <= 9999) _clusterArgs = CLUSTER.C4;

  const _icon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" style="width:100%; height:100%;">
      <defs>
        <g id="a" transform="rotate(45)">
          <path d="M0 47A47 47 0 0 0 47 0L62 0A62 62 0 0 1 0 62Z" fill-opacity="0.5"/>
          <path d="M0 67A67 67 0 0 0 67 0L81 0A81 81 0 0 1 0 81Z" fill-opacity="0.3"/>
          <path d="M0 86A86 86 0 0 0 86 0L100 0A100 100 0 0 1 0 100Z" fill-opacity="0.1"/>
        </g>
      </defs>

      <g fill="${_clusterArgs.color}">
        <circle r="42"/>
        <use href="#a"/>
        <use href="#a" transform="rotate(120)"/>
        <use href="#a" transform="rotate(240)"/>
      </g>

      <text text-anchor="middle" y="8" fill="#fff" style="font-weight:bold; font-family:inherit; font-size:28px;">
        ${count}
      </text>
    </svg>
  `;

  return L.divIcon({
    html: _icon,
    className: `marker-cluster `,
    iconSize: L.point(_clusterArgs.size, _clusterArgs.size),
    iconAnchor: [_clusterArgs.size / 2, _clusterArgs.size / 2],
  });
};

const icon = "/icons/logis-truck.png";

const RenderSingleMarker = (label: string, rotation: number) => {
  const _icon = `
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
      <h1 style="
        font-weight: bold;
        text-align: center;
        margin-top: 7px;
        background-color: white;
        padding: 2px 6px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.2);">
          ${label}
      </h1>
    </div>`;

  return L.divIcon({
    html: _icon,
    className: "single-marker",
    iconSize: [80, 20],
    iconAnchor: [40, 10],
  });
};

const ClusterMap = ({ locations, onClick }: ClusterMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any>(null);

  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    setIsRender(true);
  }, []);

  useEffect(() => {
    if (!isRender) return;

    const initMap = async () => {
      await import("leaflet.markercluster");

      if (!mapRef.current) {
        mapRef.current = L.map("map-inline-fixed", {
          minZoom: 5,
          maxZoom: 18,
          preferCanvas: true,
        }).setView([-2.2331, 117.284], 5);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
        }).addTo(mapRef.current);

        delete (L.Icon.Default.prototype as any)._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      }

      if (clusterGroupRef.current) {
        mapRef.current.removeLayer(clusterGroupRef.current);
      }

      const _cluster_marker = L.markerClusterGroup({
        chunkedLoading: true,
        removeOutsideVisibleBounds: true,
        showCoverageOnHover: false,
        iconCreateFunction: function (_cluster) {
          const _markers = _cluster.getAllChildMarkers();
          let _count = 0;

          _markers.forEach((_marker: any) => {
            _count += _marker.total || 1;
          });

          return RenderClusterMarker(_count);
        },
      });

      const _single_marker = (_data: any[]) => {
        if (_data?.length === 1) {
          return RenderSingleMarker(
            _data?.[0]?.licensePlate,
            _data?.[0]?.direction,
          );
        } else {
          const _count = _data?.length;
          return RenderClusterMarker(_count);
        }
      };

      const _data = new Map();
      for (let i = 0; i < locations.length; i++) {
        const _item = locations[i];
        const _key = `${_item?.latitude || 0}_${_item?.longitude || 0}`;

        if (!_data.has(_key)) {
          _data.set(_key, {
            latitude: _item?.latitude || 0,
            longitude: _item?.longitude || 0,
            data: [],
          });
        }
        _data.get(_key).data.push(_item);
      }

      const _marks: L.Marker[] = [];

      _data.forEach((_group) => {
        const _marker = L.marker([_group.latitude, _group.longitude], {
          icon: _single_marker(_group?.data),
        });

        (_marker as any).total = _group.data.length;

        _marker.on("click", () => {
          if (typeof onClick === "function") onClick(_group);
        });

        _marks.push(_marker);
      });

      _cluster_marker.addLayers(_marks);
      mapRef.current.addLayer(_cluster_marker);
      clusterGroupRef.current = _cluster_marker;

      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isRender, locations]);

  if (!isRender) return null;

  return (
    <div
      id="map-inline-fixed"
      style={{
        height: "500px",
        width: "100%",
        backgroundColor: "#f0f0f0",
        position: "relative",
      }}
    />
  );
};

export default ClusterMap;
