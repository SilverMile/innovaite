// @ts-ignore
import Navvybar from './navbar.jsx';
import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapView from "./components/mapView";
import UserLogin from "./components/UserLogin";
import { getStoredUser, type StoredUser } from "./utils/userStorage";

function App(): React.JSX.Element {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const existingUser = getStoredUser();
    if (existingUser) {
      setCurrentUser(existingUser);
    }
  }, []);

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
                  </div>
                  <div style={{ flex: 1, position: "relative" }}>
                    <MapView currentUser={currentUser} />
                  </div>
                </div>
              }
            />
            <Route path="/login" element={<UserLogin onUserSet={setCurrentUser} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
