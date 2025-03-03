import { View, ScrollView } from 'react-native';
import { useState, useContext, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Background } from '../components/Background';

// Components
import { NextPrayerCountdown } from '../components/NextPrayerCountdown';
import { PrayerTimesList } from '../components/PrayerTimesList';

// Types
import { PrayerTimes, NextPrayer } from '../types/prayer';
import { City } from '../types/city';
import { PrayerTheme } from '../types/theme';

// Context
import { ThemeContext } from '../context/ThemeContext';

// Services
import { prayerTimesService } from '../services/prayerTimes.service';

// Constants
import { CITIES } from '../constants/cities';

// Styles
import { homeStyles } from '../styles/home.styles';

const STORAGE_KEY = 'selectedCity';

export default function HomeScreen() {
  const { isDarkMode } = useContext(ThemeContext);
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
    <View style={{ flex: 1, backgroundColor: '#F7F9FC' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Background />
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
    </View>
  );
}
