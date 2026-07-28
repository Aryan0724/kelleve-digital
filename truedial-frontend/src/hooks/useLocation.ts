import { useState, useEffect } from 'react';

export interface UseLocationReturn {
  location: string;
  locationsList: string[];
  setLocation: (loc: string) => void;
  loading: boolean;
  error: string | null;
  detectLocation: () => void;
}

export function useLocation(defaultLocation: string = "Mumbai"): UseLocationReturn {
  const [location, setLocation] = useState<string>(defaultLocation);
  const [locationsList, setLocationsList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available locations from backend
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/locations?active_only=1`);
        if (res.ok) {
          const data = await res.json();
          const locs = data.data || [];
          setLocationsList(locs);
          if (locs.length > 0 && !location) {
            setLocation(locs[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch locations from API", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use a free reverse geocoding API to get the city
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();
          
          if (data.city || data.locality) {
            const detectedCity = data.city || data.locality;
            setLocation(detectedCity);
            
            // Optionally, check if it's in our list and add it if not
            if (!locationsList.includes(detectedCity)) {
               setLocationsList(prev => [detectedCity, ...prev]);
            }
          }
        } catch (err) {
          setError("Failed to determine location from GPS.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        setError("Location permission denied. Please select manually.");
      }
    );
  };

  return {
    location,
    locationsList,
    setLocation,
    loading,
    error,
    detectLocation
  };
}
