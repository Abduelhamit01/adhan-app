import * as Location from 'expo-location';
import { PrayerTimes, NextPrayer } from '../types/prayer';

interface AladhanResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
  };
}

class PrayerTimesService {
  async getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({});
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses && addresses.length > 0) {
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          city: addresses[0].city || addresses[0].subregion || 'Unknown City'
        };
      }
      throw new Error('Could not determine location');
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  async fetchPrayerTimes(cityId: string, date: Date) {
    try {
      const city = this.getCityById(cityId);
      if (!city) {
        throw new Error('Stadt nicht gefunden');
      }

      const { latitude, longitude } = city.coordinates;
      const timestamp = Math.floor(date.getTime() / 1000);

      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${timestamp}?` +
        `latitude=${latitude}&` +
        `longitude=${longitude}&` +
        `method=3&` +
        `school=1&` +
        `midnightMode=1&` +
        `timezonestring=Europe/Berlin&` +
        `latitudeAdjustmentMethod=1&` +
        `adjustment=1&` +
        `tune=2,2,0,0,2,2,2,2,0&` +
        `fajrAngle=15&` +
        `ishaAngle=15`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'PrayerTimesApp/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Gebetszeiten');
      }

      const data: AladhanResponse = await response.json();
      
      // Convert API response to our format with Arabic names
      return {
        Fajr: this.adjustTime(data.data.timings.Fajr, -10),
        Sunrise: data.data.timings.Sunrise,
        Dhuhr: data.data.timings.Dhuhr,
        Asr: this.adjustTime(data.data.timings.Asr, 5),
        Maghrib: data.data.timings.Maghrib,
        Isha: data.data.timings.Isha
      };
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      throw error;
    }
  }

  private adjustTime(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes, 0, 0);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  private getCityById(cityId: string) {
    // For now return Frankfurt as default
    return {
      id: '1',
      name: 'Frankfurt am Main',
      coordinates: { latitude: 50.1109, longitude: 8.6821 }
    };
  }

  getNextPrayer(prayerTimes: PrayerTimes): NextPrayer {
    if (!prayerTimes || Object.keys(prayerTimes).length === 0) {
      return null;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'Fajr', time: prayerTimes.Fajr },
      { name: 'Sunrise', time: prayerTimes.Sunrise },
      { name: 'Dhuhr', time: prayerTimes.Dhuhr },
      { name: 'Asr', time: prayerTimes.Asr },
      { name: 'Maghrib', time: prayerTimes.Maghrib },
      { name: 'Isha', time: prayerTimes.Isha }
    ];

    // Find the next prayer
    for (const prayer of prayers) {
      if (!prayer.time) continue;
      
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;

      if (prayerTime > currentTime) {
        return prayer;
      }
    }

    // If no prayer is found, return the first prayer of the next day
    return prayers[0];
  }

  getTimeUntilNextPrayer(nextPrayer: { name: string; time: string }): number {
    if (!nextPrayer || !nextPrayer.time) return 0;

    const now = new Date();
    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);

    // If the prayer time has already passed today, it's for tomorrow
    if (prayerTime < now) {
      prayerTime.setDate(prayerTime.getDate() + 1);
    }

    return Math.max(0, prayerTime.getTime() - now.getTime());
  }

  formatTimeUntilPrayer(timeInMs: number): string {
    const seconds = Math.floor((timeInMs / 1000) % 60);
    const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
    const hours = Math.floor(timeInMs / (1000 * 60 * 60));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

export const prayerTimesService = new PrayerTimesService(); 