"use client";

import { MapCoordinates } from "@/lib/types";
import { LatLng, LeafletEvent, LeafletMouseEvent } from "leaflet";
import { useMap, useMapEvents } from "react-leaflet";

interface MapEventsHandlerProps {
  closeMarkerPopup: () => void;
  onMoveEnd: (coords: MapCoordinates) => void;
}

//  Component to handle map events and to perform functionalities besides the default ones
let startedInsidePopup = false;
export default function MapEventsHandler({ closeMarkerPopup, onMoveEnd }: MapEventsHandlerProps) {
  const map = useMap();

  useMapEvents({
    mousedown: (e: LeafletMouseEvent) => {
      const target = e.originalEvent.target as HTMLElement;
      startedInsidePopup = !!target.closest(".marker-popup");
    },
    click: (e: LeafletMouseEvent) => {
      if (startedInsidePopup) {
        // Reset and dont close
        startedInsidePopup = false;
        return;
      }
      const target = e.originalEvent.target as HTMLElement;
      if (target.closest(".marker-popup")) {
        // Click inside popup, dont close
        return;
      }
      closeMarkerPopup();
    },

    moveend: (event: LeafletEvent) => {
      const center = event.target.getCenter() as LatLng;
      const zoom = event.target.getZoom() as number;
      const bounds = map.getBounds();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      onMoveEnd({ center, zoom, northEast, southWest });
    },
    movestart: () => {
      closeMarkerPopup();
    },
  });

  return null;
}
