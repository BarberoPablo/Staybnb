"use client";

import { useListingForm } from "@/store/useListingForm";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "./leaflet";
import { reverseGeocode } from "@/lib/utils";

export default function MapLocation() {
  const lat = useListingForm((s) => s.lat);
  const lng = useListingForm((s) => s.lng);
  const location = useListingForm((s) => s.location);
  const setField = useListingForm((s) => s.setField);

  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(lat && lng ? [lat, lng] : null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMove = useCallback(async (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    setField("lat", lat);
    setField("lng", lng);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const address = await reverseGeocode(lat, lng);
      setField("location", address);
      console.log("Update location", address);
    }, 800);
    console.log("Update coords", lat, lng);
  }, []);

  useEffect(() => {
    if (!markerPosition && typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          handleMove(userLat, userLng);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          // If fails use Buenos Aires
          handleMove(-34.6037, -58.3816);
        }
      );
    }
  }, [markerPosition, handleMove]);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  if (!markerPosition) return <p className="text-sm text-gray-500">Loading map...</p>;

  return (
    <div>
      <MapContainer center={markerPosition} zoom={13} scrollWheelZoom={true} className="rounded-xl" style={{ height: "300px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
        <Marker
          position={markerPosition}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              handleMove(position.lat, position.lng);
            },
          }}
        />
        <DraggableMarker onMove={handleMove} />
      </MapContainer>
      <p className="text-sm text-gray-500 mt-2">Current location: {location || `${markerPosition[0].toFixed(4)}, ${markerPosition[1].toFixed(4)}`}</p>{" "}
    </div>
  );
}

function DraggableMarker({ onMove }: { onMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}
