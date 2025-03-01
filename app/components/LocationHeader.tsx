import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { CitySelectionModal } from './CitySelectionModal';
import { City } from '../types/city';
import { CITIES } from '../constants/cities';

interface LocationHeaderProps {
  cityName: string;
  onCityChange?: (city: City) => void;
  selectedCityId: string;
}

const QIBLA_THRESHOLD = 5; // Degrees of tolerance for Qibla direction
const RESET_THRESHOLD = 20; // Degrees to move away before allowing new vibration
const KAABA_COORDS = {
  latitude: 21.422487,  // Präzisere Koordinaten
  longitude: 39.826206
};

// Optimierte Werte für flüssigere Bewegung
const SMOOTHING_FACTOR = 5;
const UPDATE_INTERVAL = 16; // ~60fps
const LERP_FACTOR = 0.2; // Interpolationsfaktor

export const LocationHeader: React.FC<LocationHeaderProps> = ({ 
  cityName,
  onCityChange,
  selectedCityId
}) => {
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [deviceDirection, setDeviceDirection] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const hasVibratedRef = useRef(false);
  const lastDiffRef = useRef(360);
  const lastDeviceDirectionRef = useRef(0);
  const angleReadings = useRef<number[]>([]);

  // Lineare Interpolation für sanfte Übergänge
  const lerp = (start: number, end: number, factor: number) => {
    // Behandle den Übergang von 359° zu 0° und umgekehrt
    if (Math.abs(end - start) > 180) {
      if (end > start) {
        start += 360;
      } else {
        end += 360;
      }
    }
    const result = start + (end - start) * factor;
    return result % 360;
  };

  useEffect(() => {
    let subscription: any;
    let animationFrameId: number;
    let isActive = true;

    const startMagnetometer = async () => {
      try {
        await Magnetometer.requestPermissionsAsync();
        await Magnetometer.setUpdateInterval(UPDATE_INTERVAL);

        subscription = Magnetometer.addListener(data => {
          if (!isActive) return;

          // Berechne den Winkel
          let angle = Math.atan2(-data.x, -data.y) * (180 / Math.PI);
          if (angle < 0) angle += 360;

          // Plattformspezifische Korrekturen
          if (Platform.OS === 'ios') {
            angle = (angle + 90) % 360;
          } else {
            angle = (angle + 180) % 360;
          }

          // Füge neue Messung zum gleitenden Durchschnitt hinzu
          angleReadings.current.push(angle);
          if (angleReadings.current.length > SMOOTHING_FACTOR) {
            angleReadings.current.shift();
          }

          // Berechne den Durchschnitt
          const avgAngle = angleReadings.current.reduce((a, b) => a + b, 0) / angleReadings.current.length;

          // Interpoliere zwischen dem letzten und dem neuen Wert
          const smoothedAngle = lerp(lastDeviceDirectionRef.current, avgAngle, LERP_FACTOR);
          lastDeviceDirectionRef.current = smoothedAngle;

          // Aktualisiere die Richtung
          setDeviceDirection(smoothedAngle);

          // Berechne den Fortschritt und die Vibration
          const diff = Math.abs((360 + smoothedAngle - qiblaDirection) % 360);
          const progressValue = Math.max(0, 1 - (diff / 180));
          setProgress(progressValue);

          if (diff < QIBLA_THRESHOLD && !hasVibratedRef.current) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            hasVibratedRef.current = true;
          } else if (diff > RESET_THRESHOLD && hasVibratedRef.current) {
            hasVibratedRef.current = false;
          }

          lastDiffRef.current = diff;
        });
      } catch (error) {
        console.error('Error starting magnetometer:', error);
      }
    };

    const calculateQiblaDirection = async () => {
      try {
        let latitude: number;
        let longitude: number;

        if (selectedCityId.startsWith('loc_')) {
          const [_, lat, lon] = selectedCityId.split('_');
          latitude = parseFloat(lat);
          longitude = parseFloat(lon);
        } else {
          const city = CITIES.find(c => c.id === selectedCityId);
          if (!city) return;
          latitude = city.coordinates.latitude;
          longitude = city.coordinates.longitude;
        }

        const φ1 = latitude * Math.PI / 180;
        const φ2 = KAABA_COORDS.latitude * Math.PI / 180;
        const Δλ = (KAABA_COORDS.longitude - longitude) * Math.PI / 180;

        const numerator = Math.sin(Δλ);
        const denominator = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
        let qibla = Math.atan2(numerator, denominator) * 180 / Math.PI;

        qibla = (qibla + 360) % 360;

        if (Platform.OS === 'ios') {
          qibla = (qibla + 90) % 360;
        } else {
          qibla = (qibla + 180) % 360;
        }

        setQiblaDirection(qibla);
      } catch (error) {
        console.error('Error calculating Qibla direction:', error);
      }
    };

    angleReadings.current = [];
    lastDeviceDirectionRef.current = deviceDirection;

    startMagnetometer();
    calculateQiblaDirection();

    return () => {
      isActive = false;
      if (subscription) {
        subscription.remove();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [selectedCityId]);

  const arrowRotation = ((360 + qiblaDirection - deviceDirection) % 360);

  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.arrowContainer}>
          <Svg width={48} height={48} viewBox="0 0 48 48">
            <Circle
              cx="24"
              cy="24"
              r="20"
              stroke="#E5E5E5"
              strokeWidth="2"
              fill="none"
            />
            <Circle
              cx="24"
              cy="24"
              r="20"
              stroke="#566B85"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${Math.PI * 40}`}
              strokeDashoffset={`${Math.PI * 40 * (1 - progress)}`}
            />
            <G
              rotation={arrowRotation}
              origin="24, 24"
            >
              <Path
                d="M24 12 L28 24 L24 22 L20 24 Z"
                fill="#566B85"
                stroke="#566B85"
                strokeWidth="1"
              />
            </G>
          </Svg>
        </View>
        <Text style={styles.cityName}>{cityName.toUpperCase()}</Text>
        <MaterialCommunityIcons 
          name="chevron-down" 
          size={24} 
          color="#566B85"
          style={styles.chevron}
        />
      </TouchableOpacity>

      <CitySelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectCity={(city) => {
          if (onCityChange) {
            onCityChange(city);
          }
          setModalVisible(false);
        }}
        selectedCityId={selectedCityId}
      />
    </>
  );
};

export default LocationHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  arrowContainer: {
    width: 48,
    height: 48,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
  },
  cityName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#566B85',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  chevron: {
    marginLeft: 8,
  }
}); 