import React from 'react';
import { View, Text } from 'react-native';
import { prayerListStyles } from '../styles/prayerList.styles';
import { PrayerTimes, NextPrayer } from '../types/prayer';
import { PrayerTheme } from '../types/theme';

interface PrayerTimesListProps {
  prayerTimes: PrayerTimes;
  nextPrayer: NextPrayer | null;
  currentTheme: PrayerTheme;
}

const prayerNames: { [key: string]: string } = {
  'fajr': 'Fajr',
  'sunrise': 'Shuruq',
  'dhuhr': 'Dhuhr',
  'asr': 'Asr',
  'maghrib': 'Maghrib',
  'isha': 'Isha'
};

export const PrayerTimesList: React.FC<PrayerTimesListProps> = ({
  prayerTimes,
  nextPrayer,
  currentTheme
}) => {
  const renderPrayerTime = (name: string, time: string) => {
    const isNext = nextPrayer?.name.toLowerCase() === name.toLowerCase();
    const displayName = prayerNames[name.toLowerCase()] || name;

    return (
      <View
        key={name}
        style={[
          prayerListStyles.prayerItem,
          isNext && prayerListStyles.activePrayerItem
        ]}
      >
        <Text style={prayerListStyles.prayerName}>
          {displayName}
        </Text>
        <Text style={prayerListStyles.prayerTime}>
          {time}
        </Text>
      </View>
    );
  };

  return (
    <View style={prayerListStyles.container}>
      {Object.entries(prayerTimes).map(([name, time]) => renderPrayerTime(name, time))}
    </View>
  );
}; 