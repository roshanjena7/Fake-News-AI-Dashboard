import React from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const data = [
  { country: "USA", lat: 37.0902, lng: -95.7129, value: 80 },
  { country: "India", lat: 20.5937, lng: 78.9629, value: 60 },
  { country: "UK", lat: 51.5072, lng: -0.1276, value: 40 }
];

function Heatmap() {
  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "400px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {data.map((d, i) => (
        <Circle
          key={i}
          center={[d.lat, d.lng]}
          radius={d.value * 10000}
          pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.4 }}
        />
      ))}
    </MapContainer>
  );
}

export default Heatmap;