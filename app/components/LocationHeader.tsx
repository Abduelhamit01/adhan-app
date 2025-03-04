import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { City } from '../types/city';
import { CityModal } from './CityModal';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  cityName: string;
  selectedCityId: string;
  onCityChange: (city: City) => void;
}

export const LocationHeader = ({ cityName, selectedCityId, onCityChange }: HeaderProps) => {
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [deviceDirection, setDeviceDirection] = useState(0);
  const insets = useSafeAreaInsets();

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
        setDeviceDirection(direction >= 0 ? direction : 360 + direction);
      });

      setQiblaDirection(qibla);
    };

    startMagnetometer();
    return () => subscription?.remove();
  }, []);

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

  return (
    <View style={[styles.header, { marginTop: insets.top + 20 }]}>
      <View style={styles.headerContent}>
        <MaterialCommunityIcons
          name="compass"
          size={24}
          color="#566B85"
          style={[styles.qiblaIcon, rotationStyle]}
        />
        <TouchableOpacity
          onPress={() => setCityModalVisible(true)}
          style={styles.locationButton}
        >
          <Text style={styles.locationText}>
            {cityName}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color="#566B85"
          />
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#566B85',
  },
  qiblaIcon: {
    width: 24,
    height: 24,
  },
});

export default LocationHeader; 