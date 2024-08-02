// src/Map.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "./Map.css";
import redPin from "../../assets/red_pin.png"; // ajuste o caminho conforme necessário

const ISS_ICON = new L.Icon({
  iconUrl: redPin,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);

  return null;
};

const Map = () => {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    const fetchISSLocation = async () => {
      try {
        const { data } = await axios.get(
          "http://api.open-notify.org/iss-now.json"
        );
        const { latitude, longitude } = data.iss_position;
        setPosition({ latitude, longitude });
      } catch (error) {
        console.error("Error fetching ISS location:", error);
      }
    };

    const interval = setInterval(fetchISSLocation, 5000);
    fetchISSLocation();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="map-container">
      <MapContainer
        center={[position.latitude, position.longitude]}
        zoom={4}
        className="map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <RecenterMap lat={position.latitude} lng={position.longitude} />
        <Marker
          position={[position.latitude, position.longitude]}
          icon={ISS_ICON}
        >
          <Popup>
            Estação Espacial Internacional <br /> Latitude: {position.latitude}{" "}
            <br />
            Longitude: {position.longitude}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
