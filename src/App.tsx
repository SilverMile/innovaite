import React, { useState } from "react";
import MapView from "./components/mapView";
import UserLogin from "./components/UserLogin";
import type { StoredUser } from "./utils/userStorage";

function App(): React.JSX.Element {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #dee2e6",
          padding: "0.5rem 1rem",
        }}
      >
        <h1 style={{ margin: "0", padding: "0.5rem 0", textAlign: "center", fontSize: "1.5rem" }}>
          Environmental Hazard Map
        </h1>
        <UserLogin onUserSet={setCurrentUser} />
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        <MapView currentUser={currentUser} />
      </div>
    </div>
  );
}

export default App;
