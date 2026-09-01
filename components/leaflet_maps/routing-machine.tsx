import "leaflet/dist/leaflet.css"; // import Leaflet CSS
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"; // import Leaflet Routing Machine CSS
import "leaflet-routing-machine";

import L from "leaflet";
import { useEffect } from "react";

const RoutingMachine = ({ map }: { map: any }) => {
  useEffect(() => {
    const leafletElement = L.Routing.control({
      waypoints: [
        // INDONESIA
        L.latLng(-6.1499029, 106.8844671),
        L.latLng(-6.1514496, 106.88932, 17),
      ],
      lineOptions: {
        extendToWaypoints: false,
        missingRouteTolerance: 3,
        styles: [
          {
            color: "blue",
            opacity: 0.6,
            weight: 4,
          },
        ],
      },
      addWaypoints: false,
      routeWhileDragging: true,
      // fitSelectedRoutes: false,
      // showAlternatives: false
    }).addTo(map);

    return () => {
      if (map && leafletElement) {
        map.leafletElement?.removeControl(leafletElement);
      }
    };
  }, [map]);

  return null;
};

export default RoutingMachine;
