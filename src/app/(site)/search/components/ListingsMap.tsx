import { Listing } from "@/lib/types/listing";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "@/components/Leaflet/markerStyle";
import MapEventsHandler from "@/components/Leaflet/MapBoundsUpdater";

export default function ListingsMap({ listings, onMapMove }: { listings: Listing[]; onMapMove?: (center: [number, number]) => void }) {
  const [center, setCenter] = useState<[number, number]>([-34.6037, -58.3816]);

  useEffect(() => {
    if (listings.length > 0) {
      const newCenter: [number, number] = [listings[0].location.lat, listings[0].location.lng];
      setCenter(newCenter);
    }
  }, [listings]);

  return (
    <MapContainer center={center} zoom={12} style={{ height: "100vh", width: "100%" }} scrollWheelZoom={true} className="rounded-xl">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {listings.map((listing) => (
        <Marker key={"marker-" + listing.id} position={[listing.location.lat, listing.location.lng]}>
          <Popup>{listing.title}</Popup>
        </Marker>
      ))}
      {onMapMove && <MapEventsHandler onMoveEnd={onMapMove} />}
    </MapContainer>
  );
}
