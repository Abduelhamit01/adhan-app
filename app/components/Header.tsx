import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { headerStyles } from '../styles/header.styles';

interface HeaderProps {
  cityName: string;
  onCityPress: () => void;
  currentTheme: any;
}

export const Header: React.FC<HeaderProps> = ({ cityName, onCityPress, currentTheme }) => {
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [deviceDirection, setDeviceDirection] = useState(0);

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
    <View style={headerStyles.headerContainer}>
      <BlurView intensity={20} tint="dark" style={headerStyles.header}>
        <TouchableOpacity
          style={headerStyles.locationButton}
          onPress={onCityPress}
        >
          <Text style={headerStyles.locationText}>{cityName}</Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        
        <View style={headerStyles.qiblaContainer}>
          <MaterialCommunityIcons
            name="compass"
            size={24}
            color="#FFFFFF"
            style={[headerStyles.qiblaArrow, rotationStyle]}
          />
        </View>
      </BlurView>
    </View>
  );
}; 