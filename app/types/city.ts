export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface State {
  id: string;
  name: string;
  cities: City[];
}

export interface Country {
  id: string;
  name: string;
  code: string;
  states: State[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  state: string;
  coordinates: Coordinates;
  region?: string; // Optional field for region/state information
  timestamp?: number; // Optional, used for recent cities
} 