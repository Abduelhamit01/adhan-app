export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timestamp?: number; // Optional, used for recent cities
} 