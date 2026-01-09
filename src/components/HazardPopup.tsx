import React from "react";
import type { Hazard } from "../types/Report";

interface HazardPopupProps {
  hazard: Hazard;
  currentUserId: number | null;
  onClaim: () => void;
  onComplete: () => void;
  onClose: () => void;
}

export default function HazardPopup({
  hazard,
  currentUserId,
  onClaim,
  onComplete,
  onClose,
}: HazardPopupProps): React.JSX.Element {
  const isClaimedByMe = hazard.claimed_by === currentUserId;
  const canClaim = hazard.status === "open" && currentUserId !== null;
  const canComplete = hazard.status === "claimed" && isClaimedByMe;

  return (
    <div
      style={{
        padding: "10px",
        minWidth: "200px",
        maxWidth: "300px",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <h3 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "bold" }}>
          Environmental Hazard
        </h3>
        <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
          {hazard.description}
        </p>
      </div>

      <div style={{ marginBottom: "10px", fontSize: "12px", color: "#888" }}>
        <div>
          Status:{" "}
          <span
            style={{
              fontWeight: "bold",
              color:
                hazard.status === "completed"
                  ? "#28a745"
                  : hazard.status === "claimed"
                  ? "#ffc107"
                  : "#007bff",
            }}
          >
            {hazard.status.toUpperCase()}
          </span>
        </div>
        {hazard.created_by_username && (
          <div>Created by: {hazard.created_by_username}</div>
        )}
        {hazard.claimed_by_username && (
          <div>Claimed by: {hazard.claimed_by_username}</div>
        )}
        {hazard.completed_by_username && (
          <div>Completed by: {hazard.completed_by_username}</div>
        )}
      </div>

      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {canClaim && (
          <button
            onClick={onClaim}
            style={{
              padding: "5px 10px",
              fontSize: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Claim
          </button>
        )}
        {canComplete && (
          <button
            onClick={onComplete}
            style={{
              padding: "5px 10px",
              fontSize: "12px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Mark Complete
          </button>
        )}
        <button
          onClick={onClose}
          style={{
            padding: "5px 10px",
            fontSize: "12px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

