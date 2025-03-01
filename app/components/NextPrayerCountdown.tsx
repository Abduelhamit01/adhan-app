import React from 'react';
import { View, Text } from 'react-native';
import { nextPrayerStyles } from '../styles/nextPrayer.styles';
import { NextPrayer } from '../types/prayer';
import { PrayerTheme } from '../types/theme';
import { LocationHeader } from './LocationHeader';
import { City } from '../types/city';

interface NextPrayerCountdownProps {
  nextPrayer: NextPrayer | null;
  timeUntilNextPrayer: string;
  currentTheme: PrayerTheme;
  cityName: string;
  selectedCityId: string;
  onCityChange: (city: City) => void;
}

export const NextPrayerCountdown: React.FC<NextPrayerCountdownProps> = ({
  nextPrayer,
  timeUntilNextPrayer,
  currentTheme,
  cityName,
  selectedCityId,
  onCityChange
}) => {
  if (!nextPrayer || !timeUntilNextPrayer) return null;

  const formatNumber = (num: number) => (num || 0).toString().padStart(2, '0');
  
  const timeParts = timeUntilNextPrayer.split(':');
  const hours = parseInt(timeParts[0] || '0', 10);
  const minutes = parseInt(timeParts[1] || '0', 10);
  const seconds = parseInt(timeParts[2] || '0', 10);

  return (
    <View style={[nextPrayerStyles.container, { backgroundColor: 'transparent' }]}>
      <LocationHeader 
        cityName={cityName}
        selectedCityId={selectedCityId}
        onCityChange={onCityChange}
      />
      <View style={nextPrayerStyles.timeContainer}>
        <Text style={nextPrayerStyles.timeValue}>
          {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(seconds)}
        </Text>
      <Text style={nextPrayerStyles.prayerName}>
        bis {nextPrayer.name}
      </Text>
      </View>
    </View>
  );
}; 