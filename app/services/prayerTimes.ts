import * as Location from 'expo-location';

interface PrayerTimes {
  Imsak: string;
  Gunes: string;
  Ogle: string;
  Ikindi: string;
  Aksam: string;
  Yatsi: string;
}

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

interface City {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
}

const CITIES: City[] = [
  {
    id: 'frankfurt',
    name: 'Frankfurt am Main',
    coordinates: { latitude: 50.1109, longitude: 8.6821 }
  },
  {
    id: 'berlin',
    name: 'Berlin',
    coordinates: { latitude: 52.5200, longitude: 13.4050 }
  },
  {
    id: 'munich',
    name: 'München',
    coordinates: { latitude: 48.1351, longitude: 11.5820 }
  },
  {
    id: 'hamburg',
    name: 'Hamburg',
    coordinates: { latitude: 53.5511, longitude: 9.9937 }
  },
  {
    id: 'cologne',
    name: 'Köln',
    coordinates: { latitude: 50.9375, longitude: 6.9603 }
  },
  {
    id: 'stuttgart',
    name: 'Stuttgart',
    coordinates: { latitude: 48.7758, longitude: 9.1829 }
  },
  {
    id: 'dusseldorf',
    name: 'Düsseldorf',
    coordinates: { latitude: 51.2277, longitude: 6.7735 }
  }
];

async function fetchPrayerTimes(cityId: string = "frankfurt", date: Date = new Date()): Promise<PrayerTimes | null> {
  try {
    const city = CITIES.find(c => c.id === cityId);
    if (!city) {
      // If city is not in predefined list, try to use coordinates from the ID
      if (cityId.startsWith('loc_')) {
        const [_, lat, lon] = cityId.split('_');
        return fetchPrayerTimesForLocation({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          city: 'Custom Location'
        }, date);
      }
      throw new Error('Stadt nicht gefunden');
    }

    const { latitude, longitude } = city.coordinates;
    const timestamp = Math.floor(date.getTime() / 1000);

    // DITIB-specific adjustments
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${timestamp}?` +
      `latitude=${latitude}&` +
      `longitude=${longitude}&` +
      `method=3&` + // ISNA method as base
      `school=1&` + // Hanafi
      `midnightMode=1&` + // Standard
      `timezonestring=Europe/Berlin&` +
      `latitudeAdjustmentMethod=1&` + // Middle of the night
      `adjustment=1&` + // Enable adjustments
      `tune=2,2,0,0,2,2,2,2,0&` + // Fine-tune adjustments for DITIB times
      `fajrAngle=15&` + // DITIB Fajr angle
      `ishaAngle=15`, // DITIB Isha angle
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
    
    // Apply DITIB-specific adjustments
    const times = {
      Imsak: adjustTime(data.data.timings.Fajr, -10), // Imsak is 10 minutes before Fajr
      Gunes: data.data.timings.Sunrise,
      Ogle: data.data.timings.Dhuhr,
      Ikindi: adjustTime(data.data.timings.Asr, 5), // Add 5 minutes to Asr for DITIB
      Aksam: data.data.timings.Maghrib,
      Yatsi: data.data.timings.Isha
    };
    
    return times;
  } catch (error) {
    console.error('Fehler beim Abrufen der Gebetszeiten:', error);
    return null;
  }
}

// Helper function to adjust prayer times
function adjustTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, mins + minutes, 0, 0);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function getNextPrayer(prayerTimes: PrayerTimes): { name: string; time: string } | null {
  if (!prayerTimes) return null;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'Imsak', time: prayerTimes.Imsak },
    { name: 'Güneş', time: prayerTimes.Gunes },
    { name: 'Öğle', time: prayerTimes.Ogle },
    { name: 'İkindi', time: prayerTimes.Ikindi },
    { name: 'Akşam', time: prayerTimes.Aksam },
    { name: 'Yatsı', time: prayerTimes.Yatsi }
  ];

  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    
    if (prayerMinutes > currentTime) {
      return prayer;
    }
  }

  return prayers[0];
}

function getTimeUntilNextPrayer(nextPrayer: { name: string; time: string }): number {
  if (!nextPrayer) return 0;

  const now = new Date();
  const [hours, minutes] = nextPrayer.time.split(':').map(Number);
  const prayerTime = new Date();
  prayerTime.setHours(hours, minutes, 0, 0);

  if (prayerTime < now) {
    prayerTime.setDate(prayerTime.getDate() + 1);
  }

  return Math.max(0, prayerTime.getTime() - now.getTime());
}

function formatTimeUntilPrayer(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
}

async function fetchCities(): Promise<Array<{ id: string; name: string }>> {
  return CITIES.map(({ id, name }) => ({ id, name }));
}

async function getCurrentLocation(): Promise<UserLocation | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Standortzugriff nicht erlaubt');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    // Reverse geocoding to get city name
    const [address] = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (!address) {
      throw new Error('Standort konnte nicht ermittelt werden');
    }

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      city: address.city || address.subregion || address.region || 'Unbekannt'
    };
  } catch (error) {
    console.error('Fehler bei der Standortermittlung:', error);
    return null;
  }
}

async function fetchPrayerTimesForLocation(location: UserLocation, date: Date = new Date()): Promise<PrayerTimes | null> {
  try {
    const { latitude, longitude } = location;
    const timestamp = Math.floor(date.getTime() / 1000);

    // DITIB-specific adjustments
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${timestamp}?` +
      `latitude=${latitude}&` +
      `longitude=${longitude}&` +
      `method=3&` + // ISNA method as base
      `school=1&` + // Hanafi
      `midnightMode=1&` + // Standard
      `timezonestring=Europe/Berlin&` +
      `latitudeAdjustmentMethod=1&` + // Middle of the night
      `adjustment=1&` + // Enable adjustments
      `tune=2,2,0,0,2,2,2,2,0&` + // Fine-tune adjustments for DITIB times
      `fajrAngle=15&` + // DITIB Fajr angle
      `ishaAngle=15`, // DITIB Isha angle
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
    
    // Apply DITIB-specific adjustments
    const times = {
      Imsak: adjustTime(data.data.timings.Fajr, -10), // Imsak is 10 minutes before Fajr
      Gunes: data.data.timings.Sunrise,
      Ogle: data.data.timings.Dhuhr,
      Ikindi: adjustTime(data.data.timings.Asr, 5), // Add 5 minutes to Asr for DITIB
      Aksam: data.data.timings.Maghrib,
      Yatsi: data.data.timings.Isha
    };
    
    return times;
  } catch (error) {
    console.error('Fehler beim Abrufen der Gebetszeiten:', error);
    return null;
  }
}

// Add new interface for calculation methods
interface CalculationMethod {
  id: number;
  name: string;
  params: {
    fajrAngle: number;
    ishaAngle: number;
    adjustments: number[];
  };
}

const CALCULATION_METHODS: CalculationMethod[] = [
  {
    id: 3, // ISNA with DITIB adjustments
    name: 'DITIB (Deutschland)',
    params: {
      fajrAngle: 15,
      ishaAngle: 15,
      adjustments: [-2, 0, 2, 3, 2, 2] // Anpassungen für Fajr,Sunrise,Dhuhr,Asr,Maghrib,Isha
    }
  }
];

const prayerTimesService = {
  fetchPrayerTimes,
  fetchPrayerTimesForLocation,
  getCurrentLocation,
  getNextPrayer,
  getTimeUntilNextPrayer,
  formatTimeUntilPrayer,
  fetchCities
};

export default prayerTimesService; 