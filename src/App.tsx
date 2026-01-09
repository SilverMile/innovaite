import React from "react";
import MapView from "./components/mapView";

function App(): React.JSX.Element {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ margin: "0", padding: "1rem", textAlign: "center" }}>
        Environmental Hazard Map
      </h1>
      <div style={{ flex: 1, position: "relative" }}>
        <MapView />
      </div>
    </div>
  );
}

export default App;
