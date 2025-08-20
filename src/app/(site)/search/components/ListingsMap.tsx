"use client";

import MapEventsHandler from "@/app/(site)/search/components/MapEventsHandler";
import { RoundButton } from "@/components/Button/RoundButton";
import ImagesSlider from "@/components/ImagesSlider";
import { api } from "@/lib/api/api";
import { MapCoordinates } from "@/lib/types";
import { Listing } from "@/lib/types/listing";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";
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
  const [center, setCenter] = useState<[number, number]>([-34.6037, -58.3816]);
  const [listingPopup, setListingPopup] = useState<Listing | null>(null);
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
              setListingPopup(listing);
            },
          }}
          icon={
            new Icon({
              iconUrl: `${locateListing === listing.id ? "https://i.postimg.cc/mkH5rzZ6/image.webp" : "https://i.postimg.cc/VsZmCYH4/House.png"}`,
              iconSize: [40, 40],
              iconAnchor: [40, 40],
            })
          }
        />
      ))}
      <MarkerPopup listing={listingPopup} onClose={() => setListingPopup(null)} enableMap={setMapEnabled} />
      <MapEventsHandler closeMarkerPopup={() => setListingPopup(null)} onMoveEnd={handleEndMapMove} />
      <MapController mapEnabled={mapEnabled} />
    </MapContainer>
  );
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
