import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import type { Report } from "../types/Report";
import { generateId } from "../utils/id";
import type { LeafletMouseEvent } from "leaflet";

function ClickHandler({ onAdd }: { onAdd: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onAdd(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapView() {
  const [reports, setReports] = useState<Report[]>([]);

  function addReport(lat: number, lng: number) {
    setReports((prev) => [
      ...prev,
      { id: generateId(), lat, lng, description: "Uncategorized report" },
    ]);
  }

  return (
    <MapContainer center={[25.2048, 55.2708] as [number, number]} zoom={12} style={{ height: "100vh" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <ClickHandler onAdd={addReport} />

      {reports.map((report) => (
        <Marker key={report.id} position={[report.lat, report.lng]} />
      ))}
    </MapContainer>
  );
}
