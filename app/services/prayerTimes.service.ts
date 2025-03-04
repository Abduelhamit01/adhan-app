import * as Location from 'expo-location';
import { PrayerTimes, NextPrayer } from '../types/prayer';
import { City } from '../types/city';
import { CITIES } from '../constants/cities';

// Feste Gebetszeiten als Fallback für verschiedene Regionen
const DEFAULT_PRAYER_TIMES: Record<string, PrayerTimes> = {
  // Deutschland (Standard)
  'DE': {
    Fajr: '05:30',
    Sunrise: '07:00',
    Dhuhr: '12:30',
    Asr: '15:30',
    Maghrib: '18:00',
    Isha: '19:30'
  },
  // Türkei
  'TR': {
    Fajr: '05:00',
    Sunrise: '06:30',
    Dhuhr: '13:00',
    Asr: '16:00',
    Maghrib: '19:00',
    Isha: '20:30'
  },
  // Fallback für unbekannte Regionen
  'default': {
    Fajr: '05:30',
    Sunrise: '07:00',
    Dhuhr: '12:30',
    Asr: '15:30',
    Maghrib: '18:00',
    Isha: '19:30'
  }
};

interface CacheEntry {
  date: string;
  times: PrayerTimes;
  expiryTime: number;
  source: 'aladhan' | 'local' | 'fallback';
}

class PrayerTimesService {
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private static readonly MAX_CACHE_ENTRIES = 30; // Store max 30 days of prayer times
  private prayerTimesCache: { [key: string]: CacheEntry } = {};

  async getCurrentLocation(): Promise<City | null> {
    try {
      // Erst Berechtigungsstatus prüfen
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      // Wenn keine Berechtigung vorliegt, diese anfordern
      if (existingStatus !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus !== 'granted') {
          console.warn('Standortberechtigung wurde nicht erteilt');
          return null;
        }
      }

      // Standort mit hoher Genauigkeit abrufen
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Aktualisierung alle 5 Sekunden
        distanceInterval: 100 // Aktualisierung alle 100 Meter
      });

      // Geocoding für Adressinformationen
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      let cityName = 'Aktueller Standort';
      let country = 'Unbekannt';
      let countryCode = '';
      let region = '';

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        cityName = address.city || address.subregion || address.region || 'Aktueller Standort';
        country = address.country || 'Unbekannt';
        countryCode = address.isoCountryCode || '';
        region = address.region || '';
      }

      return {
        id: 'current-location',
        name: cityName,
        country: country,
        countryCode: countryCode,
        region: region,
        state: region,
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      };
    } catch (error) {
      console.error('Fehler bei der Standortermittlung:', error);
      return null;
    }
  }

  private cleanupCache() {
    const now = Date.now();
    const cacheEntries = Object.entries(this.prayerTimesCache);
    
    // Remove expired entries
    const validEntries = cacheEntries.filter(([_, entry]) => entry.expiryTime > now);
    
    // If we still have too many entries, remove oldest ones
    if (validEntries.length > PrayerTimesService.MAX_CACHE_ENTRIES) {
      validEntries.sort((a, b) => b[1].expiryTime - a[1].expiryTime);
      validEntries.splice(PrayerTimesService.MAX_CACHE_ENTRIES);
    }
    
    // Rebuild cache with valid entries
    this.prayerTimesCache = Object.fromEntries(validEntries);
  }

  private async fetchPrayerTimesWithRetry(city: City, date: Date): Promise<{ times: PrayerTimes; source: CacheEntry['source'] }> {
    const retryDelay = (attempt: number) => Math.min(1000 * Math.pow(2, attempt), 10000);
    const maxRetries = 3;
    
    // Try Aladhan API
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const times = await this.fetchAladhanPrayerTimes(city, date);
        return { times, source: 'aladhan' };
      } catch (error) {
        console.warn(`Aladhan API attempt ${attempt + 1} failed:`, error);
        if (attempt < maxRetries - 1) await new Promise(resolve => setTimeout(resolve, retryDelay(attempt)));
      }
    }
    
    // If API fails, use local calculation or fallback
    try {
      // TODO: Implement local calculation using Adhan-JS
      throw new Error('Local calculation not implemented');
    } catch (error) {
      console.warn('Local calculation failed, using fallback times');
      return {
        times: this.getDefaultPrayerTimes(city.countryCode || 'default', date),
        source: 'fallback'
      };
    }
  }

  async fetchPrayerTimes(cityId: string, date: Date): Promise<PrayerTimes> {
    try {
      let city: City | null | undefined;
      
      if (cityId === 'current-location') {
        city = await this.getCurrentLocation();
        if (!city) {
          throw new Error('Could not determine current location');
        }
      } else {
        city = this.getCityById(cityId);
        if (!city) {
          throw new Error(`City with ID ${cityId} not found`);
        }
      }

      // Clean up expired cache entries
      this.cleanupCache();

      // Check cache first
      const dateStr = date.toISOString().split('T')[0];
      const cacheKey = `${city.id}_${dateStr}`;
      
      const cachedEntry = this.prayerTimesCache[cacheKey];
      if (cachedEntry && Date.now() < cachedEntry.expiryTime) {
        console.log(`Using cached prayer times for ${city.name} (${dateStr}) from source: ${cachedEntry.source}`);
        return cachedEntry.times;
      }

      // Fetch new times
      const { times, source } = await this.fetchPrayerTimesWithRetry(city, date);
      
      // Update cache
      this.prayerTimesCache[cacheKey] = {
        date: dateStr,
        times,
        expiryTime: Date.now() + PrayerTimesService.CACHE_DURATION,
        source
      };

      return times;
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      // Always return something valid to prevent app crashes
      return this.getDefaultPrayerTimes('default', date);
    }
  }

  private async fetchAladhanPrayerTimes(city: City, date: Date): Promise<PrayerTimes> {
    // Try with coordinates if available
    if (city.coordinates && city.coordinates.latitude && city.coordinates.longitude) {
      try {
        return await this.fetchAladhanByCoordinates(city, date);
      } catch (error) {
        // If coordinates fail, try with city name
      }
    }
    
    // Try with city name if available
    if (city.name && city.name !== 'Aktueller Standort' && city.country) {
      try {
        return await this.fetchAladhanByCity(city, date);
      } catch (error) {
        // If city name fails, throw error
        throw error;
      }
    }
    
    throw new Error('No valid method to fetch prayer times');
  }

  private async fetchAladhanByCoordinates(city: City, date: Date): Promise<PrayerTimes> {
    if (!city.coordinates || !city.coordinates.latitude || !city.coordinates.longitude) {
      throw new Error('No coordinates available');
    }
    
    const formattedDate = `${date.getDate()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    const url = `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${city.coordinates.latitude.toFixed(4)}&longitude=${city.coordinates.longitude.toFixed(4)}&method=3&school=1`;
    
    return await this.fetchFromAladhan(url);
  }

  private async fetchAladhanByCity(city: City, date: Date): Promise<PrayerTimes> {
    if (!city.name || !city.country) {
      throw new Error('No city name or country available');
    }
    
    const formattedDate = `${date.getDate()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    const url = `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}&method=3&school=1`;
    
    return await this.fetchFromAladhan(url);
  }

  private async fetchFromAladhan(url: string): Promise<PrayerTimes> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased timeout to 10 seconds
      
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Adhan Prayer Times App'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Aladhan API error details:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
          url
        });
        throw new Error(`Aladhan API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code === 200 && data.data && data.data.timings) {
        // Ensure times are in 24-hour format
        const timings = data.data.timings;
        return {
          Fajr: this.ensureTimeFormat(timings.Fajr),
          Sunrise: this.ensureTimeFormat(timings.Sunrise),
          Dhuhr: this.ensureTimeFormat(timings.Dhuhr),
          Asr: this.ensureTimeFormat(timings.Asr),
          Maghrib: this.ensureTimeFormat(timings.Maghrib),
          Isha: this.ensureTimeFormat(timings.Isha)
        };
      }
      
      console.error('Invalid Aladhan API response:', data);
      throw new Error('No prayer times found in response');
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('API request timeout');
      }
      throw error;
    }
  }

  // Helper method to ensure time is in 24-hour format
  private ensureTimeFormat(timeStr: string): string {
    try {
      // Remove any AM/PM indicators and trim
      timeStr = timeStr.replace(/\s*(AM|PM)\s*$/i, '').trim();
      
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        throw new Error('Invalid time format');
      }
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Time format error:', error);
      return timeStr; // Return original if parsing fails
    }
  }

  private getDefaultPrayerTimes(countryCode: string, date: Date): PrayerTimes {
    const baseTimesKey = DEFAULT_PRAYER_TIMES[countryCode] ? countryCode : 'default';
    const baseTimes = DEFAULT_PRAYER_TIMES[baseTimesKey];
    
    return this.adjustPrayerTimesByDate(baseTimes, date);
  }

  private adjustPrayerTimesByDate(prayerTimes: PrayerTimes, date: Date): PrayerTimes {
    const month = date.getMonth(); // 0-11
    
    // Summer (May-August)
    if (month >= 4 && month <= 7) {
      return {
        Fajr: this.adjustTime(prayerTimes.Fajr, -30),
        Sunrise: this.adjustTime(prayerTimes.Sunrise, -15),
        Dhuhr: prayerTimes.Dhuhr,
        Asr: prayerTimes.Asr,
        Maghrib: this.adjustTime(prayerTimes.Maghrib, 30),
        Isha: this.adjustTime(prayerTimes.Isha, 30)
      };
    }
    // Winter (November-February)
    else if (month >= 10 || month <= 1) {
      return {
        Fajr: this.adjustTime(prayerTimes.Fajr, 30),
        Sunrise: this.adjustTime(prayerTimes.Sunrise, 15),
        Dhuhr: prayerTimes.Dhuhr,
        Asr: prayerTimes.Asr,
        Maghrib: this.adjustTime(prayerTimes.Maghrib, -30),
        Isha: this.adjustTime(prayerTimes.Isha, -15)
      };
    }
    
    return { ...prayerTimes };
  }

  private adjustTime(timeStr: string, minutesChange: number): string {
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    let totalMinutes = hours * 60 + minutes + minutesChange;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  }

  private getCityById(cityId: string): City | undefined {
    const city = CITIES.find(c => c.id === cityId);
    if (city) {
      return city;
    }
    
    if (cityId === 'current-location') {
      return {
        id: 'current-location',
        name: 'Aktueller Standort',
        country: 'Unbekannt',
        countryCode: '',
        state: '',
        coordinates: {
          latitude: 0,
          longitude: 0
        }
      };
    }
    
    return undefined;
  }

  getNextPrayer(prayerTimes: PrayerTimes): NextPrayer | null {
    if (!prayerTimes || Object.keys(prayerTimes).length === 0) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'Fajr', time: prayerTimes.Fajr },
      { name: 'Sunrise', time: prayerTimes.Sunrise },
      { name: 'Dhuhr', time: prayerTimes.Dhuhr },
      { name: 'Asr', time: prayerTimes.Asr },
      { name: 'Maghrib', time: prayerTimes.Maghrib },
      { name: 'Isha', time: prayerTimes.Isha }
    ].filter(prayer => prayer.time);

    if (prayers.length === 0) return null;

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;

      if (prayerTime > currentTime) {
        return prayer;
      }
    }

    return prayers[0];
  }

  getTimeUntilNextPrayer(nextPrayer: { name: string; time: string }): number {
    if (!nextPrayer || !nextPrayer.time) return 0;

    const now = new Date();
    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);

    if (prayerTime < now) {
      prayerTime.setDate(prayerTime.getDate() + 1);
    }

    return prayerTime.getTime() - now.getTime();
  }

  formatTimeUntilPrayer(timeInMs: number): string {
    if (timeInMs <= 0) return '00:00:00';

    const seconds = Math.floor((timeInMs / 1000) % 60);
    const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
    const hours = Math.floor((timeInMs / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

export const prayerTimesService = new PrayerTimesService(); 