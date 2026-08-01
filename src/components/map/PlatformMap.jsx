import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const cityIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

const hotIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/482/482541.png",
  iconSize: [38, 38],
});

export default function PlatformMap({ cities }) {
  return (
    <MapContainer center={[33.5138, 36.2765]} zoom={7}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {cities.map((city) => (
        <Marker
          key={city.id}
          position={[city.lat, city.lng]}
          icon={cityIcon}
        >
          <Popup>
            <b>{city.name}</b>
          </Popup>
        </Marker>
      ))}

      {cities.map((city) =>
        city.areas.map((area) => (
          <Marker
            key={area.id}
            position={[area.lat, area.lng]}
            icon={area.orders > 100 ? hotIcon : cityIcon}
          >
            <Popup>
              <b>{area.name}</b>
              <br />
              الطلبات: {area.orders}
              <br />
              مقدمو الخدمة: {area.providers}
            </Popup>

            {area.orders > 100 && (
              <Circle
                center={[area.lat, area.lng]}
                radius={800}
                pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.3 }}
              />
            )}
          </Marker>
        ))
      )}
    </MapContainer>
  );
}
