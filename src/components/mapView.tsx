import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import type { Hazard } from "../types/Report";
import { fetchHazards, createHazard, claimHazard, completeHazard } from "../utils/api";
import type { LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import HazardPopup from "./HazardPopup";
import CreateHazardModal from "./CreateHazardModal";
import type { StoredUser } from "../utils/userStorage";

// Fix for default marker icons in React-Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different hazard statuses
const openIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNUMwIDIwLjggMTIuNSAzOCAxMi41IDM4UzI1IDIwLjggMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMFoiIGZpbGw9IiMwMDdiZmYiLz48L3N2Zz4=",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const claimedIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNUMwIDIwLjggMTIuNSAzOCAxMi41IDM4UzI1IDIwLjggMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMFoiIGZpbGw9IiNmZmMwMDciLz48L3N2Zz4=",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const completedIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNUMwIDIwLjggMTIuNSAzOCAxMi41IDM4UzI1IDIwLjggMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMFoiIGZpbGw9IiMyOGE3NDUiLz48L3N2Zz4=",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function ClickHandler({
  onAdd,
  disabled,
}: {
  onAdd: (lat: number, lng: number) => void;
  disabled: boolean;
}) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      if (!disabled) {
        onAdd(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

interface MapViewProps {
  currentUser: StoredUser | null;
}

export default function MapView({ currentUser }: MapViewProps) {
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null);
  const [createModal, setCreateModal] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    loadHazards();
  }, []);

  async function loadHazards() {
    try {
      setLoading(true);
      const data = await fetchHazards();
      setHazards(data);
    } catch (error) {
      console.error("Failed to load hazards:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleMapClick(lat: number, lng: number) {
    if (currentUser) {
      setCreateModal({ lat, lng });
    }
  }

  async function handleCreateHazard(description: string) {
    if (!createModal || !currentUser) return;

    try {
      await createHazard(createModal.lat, createModal.lng, description, currentUser.id);
      setCreateModal(null);
      await loadHazards();
    } catch (error) {
      console.error("Failed to create hazard:", error);
      alert("Failed to create hazard. Please try again.");
    }
  }

  async function handleClaimHazard() {
    if (!selectedHazard || !currentUser) return;

    try {
      await claimHazard(selectedHazard.id, currentUser.id);
      setSelectedHazard(null);
      await loadHazards();
    } catch (error: any) {
      alert(error.message || "Failed to claim hazard");
    }
  }

  async function handleCompleteHazard() {
    if (!selectedHazard || !currentUser) return;

    try {
      await completeHazard(selectedHazard.id, currentUser.id);
      setSelectedHazard(null);
      await loadHazards();
    } catch (error: any) {
      alert(error.message || "Failed to complete hazard");
    }
  }

  function getIconForHazard(hazard: Hazard) {
    if (hazard.status === "completed") return completedIcon;
    if (hazard.status === "claimed") return claimedIcon;
    return openIcon;
  }

  return (
    <>
      <MapContainer
        center={[25.2048, 55.2708] as [number, number]}
        zoom={12}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <ClickHandler onAdd={handleMapClick} disabled={!currentUser || !!createModal} />

        {hazards.map((hazard) => (
          <Marker
            key={hazard.id}
            position={[hazard.lat, hazard.lng]}
            icon={getIconForHazard(hazard)}
            eventHandlers={{
              click: () => {
                setSelectedHazard(hazard);
              },
            }}
          >
            <Popup>
              <div>
                <strong>{hazard.description}</strong>
                <br />
                Status: {hazard.status}
                <br />
                <button
                  onClick={() => setSelectedHazard(hazard)}
                  style={{
                    marginTop: "5px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedHazard && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxWidth: "400px",
            width: "90%",
          }}
        >
          <HazardPopup
            hazard={selectedHazard}
            currentUserId={currentUser?.id || null}
            onClaim={handleClaimHazard}
            onComplete={handleCompleteHazard}
            onClose={() => setSelectedHazard(null)}
          />
        </div>
      )}

      {createModal && (
        <CreateHazardModal
          lat={createModal.lat}
          lng={createModal.lng}
          onClose={() => setCreateModal(null)}
          onSubmit={handleCreateHazard}
        />
      )}

      {loading && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "10px 15px",
            borderRadius: "4px",
            zIndex: 1000,
          }}
        >
          Loading hazards...
        </div>
      )}
    </>
  );
}
