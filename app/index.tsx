import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Theme
import { prayerThemes, defaultTheme } from './theme/prayerThemes';

type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

const PRAYER_GRADIENTS: Record<PrayerName, [string, string]> = {
  Fajr: ['#F0F4F8', '#E1E8ED'],
  Sunrise: ['#FFF8E1', '#FFECB3'],
  Dhuhr: ['#FAFAFA', '#F0F0F0'],
  Asr: ['#E8F5E9', '#C8E6C9'],
  Maghrib: ['#FBE9E7', '#FFCCBC'],
  Isha: ['#EDE7F6', '#D1C4E9'],
} as const;

const STORAGE_KEY = 'selectedCity';

export default function HomeScreen() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>({});
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [timeUntilNextPrayer, setTimeUntilNextPrayer] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const currentTheme = nextPrayer 
    ? prayerThemes[nextPrayer.name as PrayerName] 
    : defaultTheme;

  // Apply dark mode adjustments if needed
  const themeWithMode = {
    ...currentTheme,
    text: isDark ? '#FFFFFF' : currentTheme.text,
    secondary: isDark ? '#2A2A2A' : currentTheme.secondary,
    background: isDark ? '#121212' : '#F8F9FA',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
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

  // Get background colors for the current prayer
  const getBackgroundColor = () => {
    if (!nextPrayer) return themeWithMode.background;
    
    const prayerName = nextPrayer.name as PrayerName;
    
    // Prayer-specific colors
    const PRAYER_COLORS = {
      Fajr: isDark ? '#1A1D2F' : '#F8FAFF',
      Sunrise: isDark ? '#2F2A1A' : '#FFFCF5',
      Dhuhr: isDark ? '#1A2F25' : '#F5FFFC',
      Asr: isDark ? '#1A252F' : '#F5FAFF',
      Maghrib: isDark ? '#2F1A1A' : '#FFF5F5',
      Isha: isDark ? '#251A2F' : '#FAF5FF',
    };
    
    return PRAYER_COLORS[prayerName] || themeWithMode.background;
  };

  return (
    <View style={{ flex: 1, backgroundColor: getBackgroundColor() }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        <NextPrayerCountdown
          nextPrayer={nextPrayer}
          timeUntilNextPrayer={timeUntilNextPrayer}
          currentTheme={themeWithMode}
          cityName={selectedCity.name}
          selectedCityId={selectedCity.id}
          onCityChange={handleCityChange}
          isDark={isDark}
        />

        <PrayerTimesList
          prayerTimes={prayerTimes}
          nextPrayer={nextPrayer}
          currentTheme={themeWithMode}
          isDark={isDark}
          timeUntilNextPrayer={timeUntilNextPrayer}
        />
      </ScrollView>
    </View>
  );
}
