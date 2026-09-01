/* eslint-disable import/no-extraneous-dependencies */
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import { decryptData } from "@sera-utils/encryptor";
import { Input } from "antd";
import React, { useEffect, useRef, useState } from "react";

interface LatLongInputProps {
  value?: { lat: number; lng: number };
  onChange?: (value: { lat: number; lng: number }) => void;
  disabled?: boolean;
}

const LatLongInput: React.FC<LatLongInputProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [currentLocation, setCurrentLocation] = useState(
    value || { lat: -6.1944, lng: 106.8229 },
  );
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: decryptData(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
    libraries: ["places"],
  });

  useEffect(() => {
    if (value) {
      setCurrentLocation(value);
    }
  }, [value]);

  const handleSearchLoad = (ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref;
  };

  const handlePlacesChanged = () => {
    if (disabled) return;
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const location = {
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0,
      };
      setCurrentLocation(location);
      onChange?.(location);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (disabled) return;
    const location = {
      lat: e.latLng?.lat() || 0,
      lng: e.latLng?.lng() || 0,
    };
    setCurrentLocation(location);
    onChange?.(location);
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (disabled) return;
    const location = {
      lat: e.latLng?.lat() || 0,
      lng: e.latLng?.lng() || 0,
    };
    setCurrentLocation(location);
    onChange?.(location);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div
      style={{
        position: "relative",
        height: "400px",
        background: "rgb(0,0,0,0.5)",
      }}
    >
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100%",
          borderRadius: "6px",
        }}
        center={currentLocation}
        zoom={15}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          streetViewControl: false,
          disableDefaultUI: true,
        }}
      >
        {/* Search Box */}
        {!disabled && (
          <StandaloneSearchBox
            onLoad={handleSearchLoad}
            onPlacesChanged={handlePlacesChanged}
          >
            <div style={{ position: "absolute", top: 10, left: 10, right: 10 }}>
              <Input
                placeholder="Search location"
                size="large"
                style={{
                  width: "100%",
                  border: "1px solid #c4c4c4",
                  borderRadius: "6px",
                }}
              />
            </div>
          </StandaloneSearchBox>
        )}

        {/* Draggable Marker */}
        <Marker
          position={currentLocation}
          draggable={!disabled}
          clickable={!disabled}
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>
    </div>
  );
};

export default LatLongInput;
