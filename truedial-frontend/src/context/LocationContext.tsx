"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LocationContextType {
  city: string;
  setCity: (city: string) => void;
  detectLocation: () => void;
  isDetecting: boolean;
  isModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

const DEFAULT_CITY = "Mumbai";

const LocationContext = createContext<LocationContextType>({
  city: DEFAULT_CITY,
  setCity: () => {},
  detectLocation: () => {},
  isDetecting: false,
  isModalOpen: false,
  openLocationModal: () => {},
  closeLocationModal: () => {},
});

const CITIES_COORDS: { name: string; lat: number; lng: number }[] = [
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Delhi NCR", lat: 28.7041, lng: 77.1025 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Surat", lat: 21.1702, lng: 72.8311 },
];

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [city, setCityState] = useState<string>(DEFAULT_CITY);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("truedial_user_city");
      if (saved) {
        setCityState(saved);
      }
    } catch (e) {
      console.error("Error reading saved city:", e);
    }
  }, []);

  const setCity = (newCity: string) => {
    setCityState(newCity);
    try {
      localStorage.setItem("truedial_user_city", newCity);
    } catch (e) {
      console.error("Error saving city:", e);
    }
    setIsModalOpen(false);
  };

  const detectLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Find closest city
        let closestCity = "Mumbai";
        let minDistance = Infinity;

        CITIES_COORDS.forEach((c) => {
          const dist =
            Math.pow(c.lat - latitude, 2) + Math.pow(c.lng - longitude, 2);
          if (dist < minDistance) {
            minDistance = dist;
            closestCity = c.name;
          }
        });

        setCity(closestCity);
        setIsDetecting(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsDetecting(false);
        alert("Could not detect location. Defaulting to Mumbai.");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <LocationContext.Provider
      value={{
        city,
        setCity,
        detectLocation,
        isDetecting,
        isModalOpen,
        openLocationModal: () => setIsModalOpen(true),
        closeLocationModal: () => setIsModalOpen(false),
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export const useUserLocation = () => useContext(LocationContext);
