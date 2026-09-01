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
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'TrueDialApp/1.0'
              }
            }
          );

          if (!response.ok) throw new Error("Failed to fetch location data");

          const data = await response.json();
          const address = data.address;
          
          const detectedCity = address.city || address.town || address.village || address.county || address.state_district || DEFAULT_CITY;
          
          setCity(detectedCity);
          setIsDetecting(false);
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setIsDetecting(false);
          alert("Could not detect location automatically. Please select manually.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsDetecting(false);
        let errorMessage = "Could not detect location. Defaulting to Mumbai.";
        if (error.code === error.PERMISSION_DENIED) {
           errorMessage = "Location access was denied. Please select city manually.";
        }
        alert(errorMessage);
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

