import { City, Country, State } from '../types/city';
import { CITIES } from '../constants/cities';

interface DiyanetLocation {
  id: number;
  country: string;
  city: string;
  region: string;
}

export class LocationService {
  private static instance: LocationService;
  private cachedCountries: Country[] = [];
  private cachedStates: Record<string, State[]> = {};
  private cachedCities: Record<string, City[]> = {};

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Sucht nach Standorten basierend auf dem Suchbegriff
   */
  public async searchLocations(query: string): Promise<DiyanetLocation[]> {
    try {
      const response = await fetch(`https://prayertimes.api.abdus.dev/api/diyanet/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching locations:', error);
      // Fallback: Erstelle DiyanetLocation-Objekte aus den lokalen Städten
      return this.getFallbackLocations(query);
    }
  }

  /**
   * Erstellt DiyanetLocation-Objekte aus den lokalen Städten
   */
  private getFallbackLocations(query: string): DiyanetLocation[] {
    const lowercaseQuery = query.toLowerCase();
    return CITIES
      .filter(city => 
        city.name.toLowerCase().includes(lowercaseQuery) ||
        city.country.toLowerCase().includes(lowercaseQuery) ||
        city.state.toLowerCase().includes(lowercaseQuery)
      )
      .map(city => ({
        id: parseInt(city.id.replace(/\D/g, '')) || Math.floor(Math.random() * 10000),
        country: city.country,
        city: city.state,
        region: city.name
      }));
  }

  /**
   * Holt alle verfügbaren Länder
   */
  public async getCountries(): Promise<Country[]> {
    if (this.cachedCountries.length > 0) {
      return this.cachedCountries;
    }

    try {
      // Wir verwenden eine Suche mit leerem String, um alle verfügbaren Länder zu erhalten
      const locations = await this.searchLocations('');
      
      // Gruppieren nach Ländern
      const countriesMap = new Map<string, Country>();
      
      locations.forEach(location => {
        if (!countriesMap.has(location.country)) {
          countriesMap.set(location.country, {
            id: location.country.toLowerCase().replace(/\s+/g, '-'),
            name: location.country,
            code: '', // Wir haben keinen Ländercode von der API
            states: []
          });
        }
      });
      
      this.cachedCountries = Array.from(countriesMap.values());
      return this.cachedCountries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      
      // Fallback: Erstelle Länder aus den lokalen Städten
      const countriesMap = new Map<string, Country>();
      
      CITIES.forEach(city => {
        if (!countriesMap.has(city.country)) {
          countriesMap.set(city.country, {
            id: city.country.toLowerCase().replace(/\s+/g, '-'),
            name: city.country,
            code: city.countryCode,
            states: []
          });
        }
      });
      
      this.cachedCountries = Array.from(countriesMap.values());
      return this.cachedCountries;
    }
  }

  /**
   * Holt alle Bundesländer/Regionen für ein bestimmtes Land
   */
  public async getStates(countryName: string): Promise<State[]> {
    if (this.cachedStates[countryName]) {
      return this.cachedStates[countryName];
    }

    try {
      const locations = await this.searchLocations(countryName);
      
      // Filtern nach dem angegebenen Land
      const countryLocations = locations.filter(loc => 
        loc.country.toLowerCase() === countryName.toLowerCase()
      );
      
      // Gruppieren nach Bundesländern/Regionen
      const statesMap = new Map<string, State>();
      
      countryLocations.forEach(location => {
        if (!statesMap.has(location.city)) {
          statesMap.set(location.city, {
            id: location.city.toLowerCase().replace(/\s+/g, '-'),
            name: location.city,
            cities: []
          });
        }
      });
      
      this.cachedStates[countryName] = Array.from(statesMap.values());
      return this.cachedStates[countryName];
    } catch (error) {
      console.error(`Error fetching states for ${countryName}:`, error);
      
      // Fallback: Erstelle Bundesländer aus den lokalen Städten
      const statesMap = new Map<string, State>();
      
      CITIES
        .filter(city => city.country.toLowerCase() === countryName.toLowerCase())
        .forEach(city => {
          if (!statesMap.has(city.state)) {
            statesMap.set(city.state, {
              id: city.state.toLowerCase().replace(/\s+/g, '-'),
              name: city.state,
              cities: []
            });
          }
        });
      
      this.cachedStates[countryName] = Array.from(statesMap.values());
      return this.cachedStates[countryName];
    }
  }

  /**
   * Holt alle Städte für ein bestimmtes Bundesland/Region
   */
  public async getCities(countryName: string, stateName: string): Promise<City[]> {
    const cacheKey = `${countryName}-${stateName}`;
    
    if (this.cachedCities[cacheKey]) {
      return this.cachedCities[cacheKey];
    }

    try {
      const locations = await this.searchLocations(stateName);
      
      // Filtern nach dem angegebenen Land und Bundesland/Region
      const stateLocations = locations.filter(loc => 
        loc.country.toLowerCase() === countryName.toLowerCase() && 
        loc.city.toLowerCase() === stateName.toLowerCase()
      );
      
      // Konvertieren in City-Objekte
      const cities = stateLocations.map(location => ({
        id: location.id.toString(),
        name: location.region,
        country: location.country,
        countryCode: '', // Wir haben keinen Ländercode von der API
        state: location.city,
        coordinates: { latitude: 0, longitude: 0 } // Wir haben keine Koordinaten von der API
      }));
      
      this.cachedCities[cacheKey] = cities;
      return cities;
    } catch (error) {
      console.error(`Error fetching cities for ${stateName} in ${countryName}:`, error);
      
      // Fallback: Filtere Städte aus den lokalen Städten
      const cities = CITIES.filter(city => 
        city.country.toLowerCase() === countryName.toLowerCase() && 
        city.state.toLowerCase() === stateName.toLowerCase()
      );
      
      this.cachedCities[cacheKey] = cities;
      return cities;
    }
  }

  /**
   * Holt eine Stadt anhand ihrer ID
   */
  public async getCityById(id: string): Promise<City | null> {
    try {
      // Durchsuche alle gecachten Städte
      for (const key in this.cachedCities) {
        const city = this.cachedCities[key].find(c => c.id === id);
        if (city) return city;
      }
      
      // Wenn die Stadt nicht im Cache ist, suche in den lokalen Städten
      const localCity = CITIES.find(c => c.id === id);
      if (localCity) return localCity;
      
      // Wenn die Stadt nicht in den lokalen Städten ist, versuche die API
      const response = await fetch(`https://prayertimes.api.abdus.dev/api/diyanet/prayertimes?location_id=${id}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Wir haben nur die Gebetszeiten, aber keine Stadtdetails
      // Wir müssen die Stadt aus dem Cache holen oder eine neue Suche durchführen
      
      // Wenn die Stadt nicht im Cache ist, führen wir eine neue Suche durch
      const locations = await this.searchLocations('');
      const location = locations.find(loc => loc.id.toString() === id);
      
      if (!location) return null;
      
      return {
        id: location.id.toString(),
        name: location.region,
        country: location.country,
        countryCode: '',
        state: location.city,
        coordinates: { latitude: 0, longitude: 0 }
      };
    } catch (error) {
      console.error(`Error fetching city with id ${id}:`, error);
      return null;
    }
  }
} 