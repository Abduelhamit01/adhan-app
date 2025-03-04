import { Country } from '../types/city';

export const LOCATIONS: Country[] = [
  {
    id: 'de',
    name: 'Deutschland',
    code: 'DE',
    states: [
      {
        id: 'bayern',
        name: 'Bayern',
        cities: [
          {
            id: 'muenchen',
            name: 'München',
            country: 'Deutschland',
            countryCode: 'DE',
            state: 'Bayern',
            coordinates: { latitude: 48.1351, longitude: 11.5820 }
          },
          {
            id: 'nuernberg',
            name: 'Nürnberg',
            country: 'Deutschland',
            countryCode: 'DE',
            state: 'Bayern',
            coordinates: { latitude: 49.4521, longitude: 11.0767 }
          }
        ]
      },
      {
        id: 'nrw',
        name: 'Nordrhein-Westfalen',
        cities: [
          {
            id: 'koeln',
            name: 'Köln',
            country: 'Deutschland',
            countryCode: 'DE',
            state: 'Nordrhein-Westfalen',
            coordinates: { latitude: 50.9375, longitude: 6.9603 }
          },
          {
            id: 'duesseldorf',
            name: 'Düsseldorf',
            country: 'Deutschland',
            countryCode: 'DE',
            state: 'Nordrhein-Westfalen',
            coordinates: { latitude: 51.2277, longitude: 6.7735 }
          }
        ]
      },
      {
        id: 'berlin',
        name: 'Berlin',
        cities: [
          {
            id: 'berlin',
            name: 'Berlin',
            country: 'Deutschland',
            countryCode: 'DE',
            state: 'Berlin',
            coordinates: { latitude: 52.5200, longitude: 13.4050 }
          }
        ]
      }
    ]
  },
  {
    id: 'tr',
    name: 'Türkei',
    code: 'TR',
    states: [
      {
        id: 'istanbul',
        name: 'Istanbul',
        cities: [
          {
            id: 'istanbul',
            name: 'Istanbul',
            country: 'Türkei',
            countryCode: 'TR',
            state: 'Istanbul',
            coordinates: { latitude: 41.0082, longitude: 28.9784 }
          }
        ]
      },
      {
        id: 'ankara',
        name: 'Ankara',
        cities: [
          {
            id: 'ankara',
            name: 'Ankara',
            country: 'Türkei',
            countryCode: 'TR',
            state: 'Ankara',
            coordinates: { latitude: 39.9334, longitude: 32.8597 }
          }
        ]
      },
      {
        id: 'izmir',
        name: 'Izmir',
        cities: [
          {
            id: 'izmir',
            name: 'Izmir',
            country: 'Türkei',
            countryCode: 'TR',
            state: 'Izmir',
            coordinates: { latitude: 38.4237, longitude: 27.1428 }
          }
        ]
      }
    ]
  }
]; 