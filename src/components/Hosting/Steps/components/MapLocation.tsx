"use client";

import { useListingForm } from "@/store/useListingForm";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "./leaflet";
import { reverseGeocode } from "@/lib/utils";
import toast from "react-hot-toast";

export default function MapLocation() {
  const lat = useListingForm((store) => store.location.lat);
  const lng = useListingForm((store) => store.location.lng);
  const formattedLocation = useListingForm((store) => store.location.formatted);
  const setField = useListingForm((store) => store.setField);

  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(lat && lng ? [lat, lng] : null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMove = useCallback(
    async (lat: number, lng: number) => {
      setMarkerPosition([lat, lng]);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(async () => {
        const address = await reverseGeocode(lat, lng);
        if (typeof address === "string") {
          toast.error(address);
          return;
        }
        setField("location", address);
      }, 800);
    },
    [setField]
  );

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
      <p className="text-sm text-gray-500 mt-2">
        Current location: {formattedLocation || `${markerPosition[0].toFixed(4)}, ${markerPosition[1].toFixed(4)}`}
      </p>
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
