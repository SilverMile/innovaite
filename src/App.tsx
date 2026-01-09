// @ts-ignore
import Navvybar from './navbar.jsx';
import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapView from "./components/mapView";
import UserLogin from "./components/UserLogin";
import type { StoredUser } from "./utils/userStorage";

function App(): React.JSX.Element {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  return (
    <Router>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <Navvybar />
        <div style={{ flex: 1, position: "relative" }}>
          <Routes>
            <Route path="/" element={<div>aarav thy map has migrated to the map page</div>} />
            <Route
              path="/map"
              element={
                <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <h1 style={{ margin: "0", padding: "1rem", textAlign: "center" }}>
                    Environmental Hazard Map
                  </h1>
                  <MapView />
                </div>
              }
            />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
