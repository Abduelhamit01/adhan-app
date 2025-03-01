import AsyncStorage from '@react-native-async-storage/async-storage';

export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  state?: string;
  postalCode?: string;
}

interface Country {
  name: string;
  code: string;
  cities: City[];
}

interface HereSearchResponse {
  items: Array<{
    title: string;
    address: {
      city: string;
      state: string;
      countryCode: string;
      countryName: string;
      postalCode: string;
    };
    position: {
      lat: number;
      lng: number;
    };
  }>;
}

const MAX_RECENT_CITIES = 5;
const HERE_API_KEY = ''; // Hier müssen Sie Ihren HERE API Key einfügen

class CitySearchService {
  private async fetchCities(query: string): Promise<City[]> {
    try {
      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?` +
        `q=${encodeURIComponent(query)}&` +
        `limit=20&` +
        `lang=de&` +
        `apiKey=${HERE_API_KEY}`
      );

      if (!response.ok) {
        console.log('API-Antwort:', await response.text());
        throw new Error(`API-Fehler: ${response.status}`);
      }

      const data = await response.json();

      if (!data.items || !Array.isArray(data.items)) {
        console.log('API-Antwort:', data);
        throw new Error('Ungültiges Antwortformat von der API');
      }

      return data.items
        .filter((item: any) => 
          item.resultType === 'locality' || 
          item.resultType === 'administrativeArea'
        )
        .map((item: any) => {
          const address = item.address;
          return {
            id: item.id,
            name: address.city || address.town || address.municipality || address.label.split(',')[0],
            country: address.countryName,
            countryCode: address.countryCode,
            coordinates: {
              latitude: item.position.lat,
              longitude: item.position.lng,
            },
            state: address.state,
            postalCode: address.postalCode
          };
        })
        .filter((city: City, index: number, self: City[]) => 
          // Entferne Duplikate basierend auf Name und Land
          index === self.findIndex((c) => 
            c.name === city.name && 
            c.countryCode === city.countryCode
          )
        );
    } catch (error) {
      console.error('Fehler bei der API-Anfrage:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      return []; // Return empty array on error
    }
  }

  async searchCities(query: string): Promise<City[]> {
    try {
      if (query.length < 2) return [];

      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(query)}&limit=20&apiKey=${HERE_API_KEY}`
      );

      if (!response.ok) {
        console.error('API-Fehler:', response.status);
        return [];
      }

      const data: HereSearchResponse = await response.json();
      
      return data.items.map(item => ({
        id: `${item.position.lat},${item.position.lng}`,
        name: item.address.city,
        country: item.address.countryName,
        countryCode: item.address.countryCode,
        coordinates: {
          latitude: item.position.lat,
          longitude: item.position.lng
        },
        state: item.address.state,
        postalCode: item.address.postalCode
      }));
    } catch (error) {
      console.error('Fehler bei der Städtesuche:', error);
      return [];
    }
  }

  groupCitiesByCountry(cities: City[]): Country[] {
    const countryMap = new Map<string, Country>();

    cities.forEach(city => {
      if (!countryMap.has(city.countryCode)) {
        countryMap.set(city.countryCode, {
          name: city.country,
          code: city.countryCode,
          cities: [],
        });
      }
      countryMap.get(city.countryCode)?.cities.push(city);
    });

    return Array.from(countryMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(country => ({
        ...country,
        cities: country.cities.sort((a, b) => a.name.localeCompare(b.name))
      }));
  }

  async getRecentCities(): Promise<City[]> {
    try {
      const recentCitiesJson = await AsyncStorage.getItem('@recent_cities');
      if (recentCitiesJson) {
        return JSON.parse(recentCitiesJson);
      }
      return [];
    } catch (error) {
      console.error('Fehler beim Laden der letzten Städte:', error);
      return [];
    }
  }

  async addRecentCity(city: City) {
    try {
      const recentCities = await this.getRecentCities();
      const updatedCities = [
        city,
        ...recentCities.filter(c => c.id !== city.id)
      ].slice(0, 5); // Behalte nur die letzten 5 Städte

      await AsyncStorage.setItem('@recent_cities', JSON.stringify(updatedCities));
    } catch (error) {
      console.error('Fehler beim Speichern der Stadt:', error);
    }
  }

  async searchNearby(latitude: number, longitude: number): Promise<City[]> {
    try {
      const response = await fetch(
        `https://discover.search.hereapi.com/v1/discover?at=${latitude},${longitude}&limit=10&apiKey=${HERE_API_KEY}`
      );

      if (!response.ok) {
        console.error('API-Fehler:', response.status);
        return [];
      }

      const data = await response.json();
      
      return data.items.map((item: any) => ({
        id: `${item.position.lat},${item.position.lng}`,
        name: item.address.city,
        country: item.address.countryName,
        countryCode: item.address.countryCode,
        coordinates: {
          latitude: item.position.lat,
          longitude: item.position.lng
        },
        state: item.address.state,
        postalCode: item.address.postalCode
      }));
    } catch (error) {
      console.error('Fehler bei der Umgebungssuche:', error);
      return [];
    }
  }
}

const citySearchService = new CitySearchService();
export default citySearchService; 