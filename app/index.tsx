import { View, ScrollView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

// Components
import { NextPrayerCountdown } from './components/NextPrayerCountdown';
import { PrayerTimesList } from './components/PrayerTimesList';

// Types
import { PrayerTimes, NextPrayer } from './types/prayer';
import { City } from './types/city';
import { PrayerTheme } from './types/theme';

// Services
import { prayerTimesService } from './services/prayerTimes.service';

// Constants
import { CITIES } from './constants/cities';

type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

const PRAYER_GRADIENTS: Record<PrayerName, [string, string, string]> = {
  Fajr: ['#F1F1FF', '#E6E6FA', '#D8D8FF'], // Dawn purple gradient
  Sunrise: ['#F8FBFF', '#E6F3FF', '#D9EEFF'], // Morning blue gradient
  Dhuhr: ['#FFF9F3', '#FFF3E6', '#FFE8CC'], // Noon beige gradient
  Asr: ['#FFFDF5', '#FFF5D6', '#FFE5A3'], // Afternoon yellow gradient
  Maghrib: ['#FFF1F1', '#FFE6E6', '#FFD9D9'], // Sunset pink gradient
  Isha: ['#F1F1FF', '#E6E6FA', '#D8D8FF'], // Night purple gradient
} as const;

const STORAGE_KEY = 'selectedCity';

export default function HomeScreen() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>({});
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [timeUntilNextPrayer, setTimeUntilNextPrayer] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentTheme: PrayerTheme = {
    primary: 'transparent',
    secondary: '#F7F9FC',
    accent: '#566B85',
    text: '#566B85'
  };

  useEffect(() => {
    // Load saved city on startup
    const loadSavedCity = async () => {
      try {
        const savedCityId = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCityId) {
          const city = CITIES.find(c => c.id === savedCityId);
          if (city) {
            setSelectedCity(city);
          }
        }
      } catch (error) {
        console.error('Error loading saved city:', error);
      }
    };

    loadSavedCity();
  }, []);

  const handleCityChange = async (city: City) => {
    setSelectedCity(city);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, city.id);
    } catch (error) {
      console.error('Error saving city:', error);
    }
  };

  const updatePrayerTimes = async () => {
    try {
      const times = await prayerTimesService.fetchPrayerTimes(selectedCity.id, new Date());
      setPrayerTimes(times);
      const next = prayerTimesService.getNextPrayer(times);
      setNextPrayer(next);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  useEffect(() => {
    updatePrayerTimes();
  }, [selectedCity]);

  useEffect(() => {
    if (nextPrayer) {      
      const interval = setInterval(() => {
        const timeUntil = prayerTimesService.getTimeUntilNextPrayer(nextPrayer);
        const formattedTime = prayerTimesService.formatTimeUntilPrayer(timeUntil);
        setTimeUntilNextPrayer(formattedTime);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextPrayer]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={nextPrayer ? PRAYER_GRADIENTS[nextPrayer.name as PrayerName] : ['#F7F9FC', '#F0F3F9', '#E8EDF5']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          
          <ScrollView
            style={{ backgroundColor: 'transparent' }}
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            <NextPrayerCountdown
              nextPrayer={nextPrayer}
              timeUntilNextPrayer={timeUntilNextPrayer}
              currentTheme={currentTheme}
              cityName={selectedCity.name}
              selectedCityId={selectedCity.id}
              onCityChange={handleCityChange}
            />

            <PrayerTimesList
              prayerTimes={prayerTimes}
              nextPrayer={nextPrayer}
              currentTheme={currentTheme}
            />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
