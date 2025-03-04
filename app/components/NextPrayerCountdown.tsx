import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NextPrayer } from '../types/prayer';
import { PrayerTheme } from '../types/theme';
import { City } from '../types/city';
import { LocationHeader } from './LocationHeader';

interface NextPrayerCountdownProps {
  nextPrayer: NextPrayer | null;
  timeUntilNextPrayer: string;
  currentTheme: PrayerTheme;
  cityName: string;
  selectedCityId: string;
  onCityChange: (city: City) => void;
}

export const NextPrayerCountdown = ({
  nextPrayer,
  timeUntilNextPrayer,
  currentTheme,
  cityName,
  selectedCityId,
  onCityChange,
}: NextPrayerCountdownProps) => {
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

  return (
    <View style={styles.container}>
      <LocationHeader 
        cityName={cityName}
        selectedCityId={selectedCityId}
        onCityChange={onCityChange}
      />
      <View style={styles.countdownContainer}>
        <Text style={[styles.timeText, { color: currentTheme.text }]}>
          {getTimeString()}
        </Text>
        <Text style={[styles.untilText, { color: currentTheme.text }]}>
          bis {nextPrayer.name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
    fontVariant: ['tabular-nums'],
  },
  untilText: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default NextPrayerCountdown; 