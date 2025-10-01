"use client";

import MapEventsHandler from "@/app/(site)/search/components/MapEventsHandler";
import { RoundButton } from "@/components/Button/RoundButton";
import ImagesSlider from "@/components/ImagesSlider";
import { searchListings } from "@/lib/api/server/api";
import { parseFilters } from "@/lib/api/server/utils";
import { MapCoordinates } from "@/lib/types";
import { Listing } from "@/lib/types/listing";
import L, { divIcon } from "leaflet";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

export default function ListingsMap({
  listings,
  locateListing,
  cityCenter,
  setListings,
  searchTriggered,
  onSearchComplete,
}: {
  listings: Listing[];
  locateListing: number;
  cityCenter: { lat: number; lng: number } | null;
  setListings: (listings: Listing[]) => void;
  searchTriggered: boolean;
  onSearchComplete: () => void;
}) {
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || undefined;
  const paramsObject: Record<string, string | string[] | undefined> = {};
  searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  const filters = parseFilters(paramsObject);
  const [center, setCenter] = useState<[number, number]>([cityCenter?.lat || 0, cityCenter?.lng || 0]);
  const [listingPopup, setListingPopup] = useState<Listing | null>(null);
  const [mapEnabled, setMapEnabled] = useState(true);
  const [shouldFlyTo, setShouldFlyTo] = useState(false);

  useEffect(() => {
    if (searchTriggered && cityCenter) {
      setShouldFlyTo(true);
      onSearchComplete();
    }
  }, [searchTriggered, cityCenter, onSearchComplete]);

  // Update center when cityCenter changes (new city selected)
  useEffect(() => {
    if (cityCenter) {
      setCenter([cityCenter.lat, cityCenter.lng]);
    }
  }, [cityCenter]);

  useEffect(() => {
    if (!cityCenter && listings.length > 0) {
      const bounds = calculateBoundsFromListings(listings);
      if (bounds) {
        setCenter(bounds.center);
      }
    }
  }, [listings, cityCenter]);

  const handleEndMapMove = async ({ zoom, northEast, southWest }: MapCoordinates) => {
    try {
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

      const { listings: newListings } = await searchListings(city, filters, serializedMapCoordinates);

      setListings(newListings);
    } catch (error) {
      console.error("Error fetching listings by moving the map", error);
    }
  };

  return (
    <MapContainer center={center} zoom={11} style={{ width: "100%", height: "100%", borderRadius: "12px", zIndex: 0 }} scrollWheelZoom={true}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={(cluster: L.MarkerCluster) => {
          const count = cluster.getChildCount();
          return divIcon({
            html: `<div class="flex items-center justify-center py-2.5 transition-all duration-300 ease-in-out
              bg-background text-foreground border-gray-300 font-semibold shadow-md rounded-full border">
              ${count}
            </div>`,
            className: "",
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });
        }}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
        maxClusterRadius={50}
      >
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
      </MarkerClusterGroup>
      <MarkerPopup listing={listingPopup} onClose={() => setListingPopup(null)} enableMap={setMapEnabled} />
      <MapEventsHandler closeMarkerPopup={() => setListingPopup(null)} onMoveEnd={handleEndMapMove} />
      <MapController mapEnabled={mapEnabled} />
      <ChangeView center={center} shouldFlyTo={shouldFlyTo} onFlyComplete={() => setShouldFlyTo(false)} />
    </MapContainer>
  );
}

function ChangeView({ center, shouldFlyTo, onFlyComplete }: { center: [number, number]; shouldFlyTo: boolean; onFlyComplete: () => void }) {
  const map = useMap();
  const prevCenterRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (shouldFlyTo) {
      map.flyTo(center, 11, {
        duration: 3,
        easeLinearity: 0.25,
      });
      onFlyComplete();
    }
    prevCenterRef.current = center;
  }, [center, map, shouldFlyTo, onFlyComplete]);

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

function calculateBoundsFromListings(listings: Listing[]): { center: [number, number] } | null {
  if (listings.length === 0) return null;

  const lats = listings.map((l) => l.location.lat);
  const lngs = listings.map((l) => l.location.lng);

  const center: [number, number] = [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2];

  return { center };
}
