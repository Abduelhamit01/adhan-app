import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NextPrayer } from '../types/prayer';
import { PrayerTheme } from '../types/theme';
import { City } from '../types/city';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { CityModal } from './CityModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import nextPrayerCountdownStyles from '../styles/nextPrayerCountdown';

interface NextPrayerCountdownProps {
  nextPrayer: NextPrayer | null;
  timeUntilNextPrayer: string;
  currentTheme: PrayerTheme & { background?: string; card?: string };
  cityName: string;
  selectedCityId: string;
  onCityChange: (city: City) => void;
  isDark?: boolean;
}

export const NextPrayerCountdown = ({
  nextPrayer,
  timeUntilNextPrayer,
  currentTheme,
  cityName,
  selectedCityId,
  onCityChange,
  isDark = false,
}: NextPrayerCountdownProps) => {
  const insets = useSafeAreaInsets();
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [deviceDirection, setDeviceDirection] = useState(0);
  const [isAligned, setIsAligned] = useState(false);

  const MECCA = {
    latitude: 21.4225,
    longitude: 39.8262
  };

  useEffect(() => {
    let subscription: any;
    
    const startMagnetometer = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const qibla = calculateQiblaDirection(
        location.coords.latitude,
        location.coords.longitude,
        MECCA.latitude,
        MECCA.longitude
      );

      subscription = Magnetometer.addListener(data => {
        const direction = Math.atan2(data.y, data.x) * (180 / Math.PI);
        const deviceDir = direction >= 0 ? direction : 360 + direction;
        setDeviceDirection(deviceDir);
        
        // Check if device is pointing towards Qibla (within 10 degrees)
        const diff = Math.abs((qiblaDirection - deviceDir + 360) % 360);
        setIsAligned(diff < 10 || diff > 350);
      });

      setQiblaDirection(qibla);
    };

    startMagnetometer();
    return () => subscription?.remove();
  }, [qiblaDirection]);

  const calculateQiblaDirection = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    lat1 = lat1 * (Math.PI / 180);
    lat2 = lat2 * (Math.PI / 180);

    const y = Math.sin(dLon);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLon);
    let qibla = Math.atan2(y, x) * (180 / Math.PI);
    return qibla >= 0 ? qibla : 360 + qibla;
  };

  const rotationStyle = {
    transform: [{ rotate: `${qiblaDirection - deviceDirection}deg` }]
  };

  if (!nextPrayer || !timeUntilNextPrayer) return null;
  
  const formatNumber = (num: number) => (num || 0).toString().padStart(2, '0');
  
  const timeParts = timeUntilNextPrayer.split(':');
  const hours = parseInt(timeParts[0] || '0', 10);
  const minutes = parseInt(timeParts[1] || '0', 10);
  const seconds = parseInt(timeParts[2] || '0', 10);

  const getTimeString = () => {
    if (hours > 0) {
      return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
    }
    return `${formatNumber(minutes)}:${formatNumber(seconds)}`;
  };

  const getPrayerEmoji = () => {
    switch(nextPrayer.name) {
      case 'Fajr': return '🌅';
      case 'Sunrise': return '☀️';
      case 'Dhuhr': return '🌤️';
      case 'Asr': return '⛅';
      case 'Maghrib': return '🌇';
      case 'Isha': return '🌙';
      default: return '⏰';
    }
  };

  return (
    <View style={[nextPrayerCountdownStyles.container, { paddingTop: insets.top + 16 }]}>
      <View style={[
        nextPrayerCountdownStyles.card, 
        { 
          backgroundColor: 'transparent',
          shadowColor: 'transparent',
        }
      ]}>
        <View style={nextPrayerCountdownStyles.headerRow}>
          <TouchableOpacity 
            style={nextPrayerCountdownStyles.qiblaButton}
            activeOpacity={0.7}
          >
            <View style={[
              nextPrayerCountdownStyles.qiblaContainer, 
              isAligned ? 
                { backgroundColor: currentTheme.accent, borderColor: currentTheme.accent } : 
                { backgroundColor: 'transparent', borderColor: isDark ? '#555' : '#ddd' }
            ]}>
              <MaterialCommunityIcons
                name="navigation"
                size={20}
                color={isAligned ? '#FFF' : currentTheme.accent}
                style={[nextPrayerCountdownStyles.qiblaIcon, rotationStyle]}
              />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setCityModalVisible(true)}
            style={nextPrayerCountdownStyles.locationButton}
          >
            <Text style={[
              nextPrayerCountdownStyles.locationText,
              { color: currentTheme.text }
            ]}>
              {cityName}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={16}
              color={isDark ? "#FFFFFF" : "#333333"}
            />
          </TouchableOpacity>
          
          <View style={nextPrayerCountdownStyles.settingsPlaceholder} />
        </View>
      </View>
      
      <CityModal
        visible={cityModalVisible}
        onDismiss={() => setCityModalVisible(false)}
        onCitySelect={onCityChange}
        selectedCityId={selectedCityId}
      />
    </View>
  );
};

export default NextPrayerCountdown; 