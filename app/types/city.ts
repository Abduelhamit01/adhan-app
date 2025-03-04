export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  region?: string; // Optional field for region/state information
  timestamp?: number; // Optional, used for recent cities
} 