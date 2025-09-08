"use client";

import MapEventsHandler from "@/app/(site)/search/components/MapEventsHandler";
import { RoundButton } from "@/components/Button/RoundButton";
import ImagesSlider from "@/components/ImagesSlider";
import { searchListings } from "@/lib/api/server/api";
import { parseFilters } from "@/lib/api/server/utils";
import { MapCoordinates } from "@/lib/types";
import { Listing } from "@/lib/types/listing";
import { divIcon } from "leaflet";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

export default function ListingsMap({
  listings,
  locateListing,
  setListings,
}: {
  listings: Listing[];
  locateListing: number;
  setListings: (listings: Listing[]) => void;
}) {
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || undefined;

  // Convert URLSearchParams to object for parseFilters
  const paramsObject: Record<string, string | string[] | undefined> = {};
  searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  const filters = parseFilters(paramsObject);
  const [center, setCenter] = useState<[number, number]>(listings[0] ? [listings[0].location.lat, listings[0].location.lng] : [0, 0]);
  const [listingPopup, setListingPopup] = useState<Listing | null>(null);
  const [mapEnabled, setMapEnabled] = useState(true);

  useEffect(() => {
    if (listings.length > 0) {
      const newCenter: [number, number] = [listings[0].location.lat, listings[0].location.lng];
      setCenter(newCenter);
    }
  }, [listings]);

  const handleEndMapMove = async ({ zoom, northEast, southWest }: MapCoordinates) => {
    try {
      // Serialize the map coordinates to plain objects to avoid client reference issues
      const serializedMapCoordinates = {
        zoom,
        northEast: {
          lat: northEast.lat,
          lng: northEast.lng,
        },
        southWest: {
          lat: southWest.lat,
          lng: southWest.lng,
        },
      };

      const listings = await searchListings(city, filters, serializedMapCoordinates);

      setListings(listings);
    } catch (error) {
      console.error("Error fetching listings by moving the map", error);
    }
  };

  return (
    <MapContainer center={center} zoom={12} style={{ width: "100%", height: "100%", borderRadius: "12px", zIndex: 0 }} scrollWheelZoom={true}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {listings.map((listing) => (
        <Marker
          key={"marker-" + listing.id}
          position={[listing.location.lat, listing.location.lng]}
          eventHandlers={{
            click: () => {
              setListingPopup(listing);
            },
          }}
          icon={divIcon({
            html: `<div class="flex items-center justify-center py-1 transition-all duration-300 ease-in-out
            ${
              locateListing === listing.id
                ? "bg-foreground text-background border-gray-600 font-bold"
                : "bg-background text-foreground border-gray-300 font-semibold"
            } 
            shadow-md rounded-full border">
              $${listing.nightPrice} USD
            </div>`,

            className: "", // Important to avoid leaflet to apply the default Leaflet class
            iconSize: [70, 40],
            iconAnchor: [20, 20],
          })}
        />
      ))}
      <MarkerPopup listing={listingPopup} onClose={() => setListingPopup(null)} enableMap={setMapEnabled} />
      <MapEventsHandler closeMarkerPopup={() => setListingPopup(null)} onMoveEnd={handleEndMapMove} />
      <MapController mapEnabled={mapEnabled} />
      <ChangeView center={center} />
    </MapContainer>
  );
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  const prevCenterRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (prevCenterRef.current && (prevCenterRef.current[0] !== center[0] || prevCenterRef.current[1] !== center[1])) {
      map.flyTo(center, 12, {
        duration: 3,
        easeLinearity: 0.25,
      });
    }
    prevCenterRef.current = center;
  }, [center, map]);

  return null;
}

function MapController({ mapEnabled }: { mapEnabled: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (mapEnabled) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
    }
  }, [mapEnabled, map]);

  return null;
}

function MarkerPopup({ listing, onClose, enableMap }: { listing: Listing | null; onClose: () => void; enableMap: (hovered: boolean) => void }) {
  if (!listing) return null;

  const handleClose = () => {
    enableMap(true);
    onClose();
  };

  return (
    <div
      className="marker-popup absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[2000] 
      w-80 bg-background border border-gray-200 rounded-xl overflow-hidden shadow-lg"
      onMouseEnter={() => enableMap(false)}
      onMouseLeave={() => enableMap(true)}
    >
      <div className="relative">
        {/* Image */}
        <ImagesSlider images={listing.images} hoverEffect={true} containerClassName="rounded-t-xl" />

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full shadow-md border border-gray-100">
          <span className="font-semibold text-myGrayDark">${listing.nightPrice}</span>
          <span className="text-sm text-myGray">/night</span>
        </div>

        {/* Close Button */}
        <RoundButton onClick={handleClose} className="absolute top-3 right-3 text-3xl text-myGray bg-white hover:bg-myGrayLight shadow-md">
          <IoIosClose />
        </RoundButton>
      </div>
    </div>
  );
}
