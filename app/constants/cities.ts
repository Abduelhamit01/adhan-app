import { City } from '../types/city';

// Fallback-Städte, falls die API nicht verfügbar ist
export const CITIES: City[] = [
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Türkei',
    countryCode: 'TR',
    state: 'Istanbul',
    coordinates: { latitude: 41.0082, longitude: 28.9784 }
  },
  {
    id: 'ankara',
    name: 'Ankara',
    country: 'Türkei',
    countryCode: 'TR',
    state: 'Ankara',
    coordinates: { latitude: 39.9334, longitude: 32.8597 }
  },
  {
    id: 'izmir',
    name: 'Izmir',
    country: 'Türkei',
    countryCode: 'TR',
    state: 'Izmir',
    coordinates: { latitude: 38.4237, longitude: 27.1428 }
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Deutschland',
    countryCode: 'DE',
    state: 'Berlin',
    coordinates: { latitude: 52.5200, longitude: 13.4050 }
  },
  {
    id: 'hamburg',
    name: 'Hamburg',
    country: 'Deutschland',
    countryCode: 'DE',
    state: 'Hamburg',
    coordinates: { latitude: 53.5511, longitude: 9.9937 }
  },
  {
    id: 'muenchen',
    name: 'München',
    country: 'Deutschland',
    countryCode: 'DE',
    state: 'Bayern',
    coordinates: { latitude: 48.1351, longitude: 11.5820 }
  },
  {
    id: 'koeln',
    name: 'Köln',
    country: 'Deutschland',
    countryCode: 'DE',
    state: 'Nordrhein-Westfalen',
    coordinates: { latitude: 50.9375, longitude: 6.9603 }
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt',
    country: 'Deutschland',
    countryCode: 'DE',
    state: 'Hessen',
    coordinates: { latitude: 50.1109, longitude: 8.6821 }
  },
  {
    id: 'stuttgart',
    name: 'Stuttgart',
    country: 'Deutschland',
    countryCode: 'DE',
    state: 'Baden-Württemberg',
    coordinates: { latitude: 48.7758, longitude: 9.1829 }
  },
  {
    id: 'duesseldorf',
    name: 'Düsseldorf',
    country: 'Deutschland',
    countryCode: 'DE',
    state: 'Nordrhein-Westfalen',
    coordinates: { latitude: 51.2277, longitude: 6.7735 }
  }
]; 