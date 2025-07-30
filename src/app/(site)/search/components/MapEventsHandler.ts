"use client";

import { MapCoordinates } from "@/lib/types";
import { LatLng, LeafletEvent } from "leaflet";
import { useMap, useMapEvent } from "react-leaflet";

interface MapEventsHandlerProps {
  onMoveEnd: (coords: MapCoordinates) => void;
}

export default function MapEventsHandler({ onMoveEnd }: MapEventsHandlerProps) {
  const map = useMap();

  useMapEvent("moveend", (event: LeafletEvent) => {
    const center = event.target.getCenter() as LatLng;
    const zoom = event.target.getZoom() as number;
    const bounds = map.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    onMoveEnd({ center, zoom, northEast, southWest });
  });

  return null;
}
