"use client";

import MapEventsHandler from "@/app/(site)/search/components/MapEventsHandler";
import { RoundButton } from "@/components/Button/RoundButton";
import ImagesSlider from "@/components/ImagesSlider";
import "@/components/Leaflet/markerStyle";
import { NightPriceWithPromotion } from "@/components/Promotions/NightPriceWithPromotion";
import { api } from "@/lib/api/api";
import { MapCoordinates } from "@/lib/types";
import { Listing } from "@/lib/types/listing";
import { twoDecimalsString } from "@/lib/utils";
import { useEffect, useState } from "react";
import { IoIosClose, IoIosStar } from "react-icons/io";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

export default function ListingsMap({ listings, setListings }: { listings: Listing[]; setListings: (listings: Listing[]) => void }) {
  const [center, setCenter] = useState<[number, number]>([-34.6037, -58.3816]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mapEnabled, setMapEnabled] = useState(true);

  useEffect(() => {
    if (listings.length > 0) {
      const newCenter: [number, number] = [listings[0].location.lat, listings[0].location.lng];
      setCenter(newCenter);
    }
  }, [listings]);

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

  const handleEndMapMove = async ({ zoom, northEast, southWest }: MapCoordinates) => {
    try {
      const listings = await api.getListings({ zoom, northEast, southWest });

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
              setSelectedListing(listing);
            },
          }}
        />
      ))}
      <MarkerPopup listing={selectedListing} onClose={() => setSelectedListing(null)} enableMap={setMapEnabled} />
      <MapEventsHandler closeMarkerPopup={() => setSelectedListing(null)} onMoveEnd={handleEndMapMove} />
      <MapController mapEnabled={mapEnabled} />
    </MapContainer>
  );
}

function MarkerPopup({ listing, onClose, enableMap }: { listing: Listing | null; onClose: () => void; enableMap: (hovered: boolean) => void }) {
  if (!listing) return null;

  return (
    <div
      className="marker-popup flex flex-col gap-2 items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[2000] 
      w-68 h-73 bg-background rounded-xl shadow-md hover:cursor-pointer"
      style={{ fontFamily: "roboto" }}
      onMouseEnter={() => enableMap(false)}
      onMouseLeave={() => enableMap(true)}
    >
      <div className="flex flex-col w-full overflow-hidden">
        <ImagesSlider images={listing.images} containerClassName="rounded-b-none" />
      </div>
      <RoundButton onClick={onClose} className="absolute top-2 right-2 text-[32px]">
        <IoIosClose />
      </RoundButton>

      <div className="flex flex-col justify-center gap-1 w-full px-3 mb-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">
            {listing.propertyType} in {listing.location.city}
          </h2>
          <div className="flex items-center justify-center gap-1 font-semibold text-sm">
            <IoIosStar className="mb-0.5" />
            <h2>
              {twoDecimalsString(listing.score.value)} ({listing.score.reviews.length})
            </h2>
          </div>
        </div>
        <h3 className="truncate text-sm text-myGray">{listing.location.formatted}</h3>
        <NightPriceWithPromotion listing={listing} />
      </div>
    </div>
  );
}
