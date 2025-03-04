import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PrayerTimes, NextPrayer } from '../types/prayer';
import { PrayerTheme } from '../types/theme';

const PRAYER_NAMES = {
  Fajr: 'Fajr',
  Sunrise: 'Sunrise',
  Dhuhr: 'Dhuhr',
  Asr: 'Asr',
  Maghrib: 'Maghrib',
  Isha: 'Isha',
};

const PRAYER_BORDER_COLORS = {
  Fajr: '#B4B4FF', // Dunkleres Violett
  Sunrise: '#99CCFF', // Dunkleres Hellblau
  Dhuhr: '#FFD699', // Dunkleres Beige
  Asr: '#FFD24D', // Dunkleres Gelb
  Maghrib: '#FFB3B3', // Dunkleres Rosa
  Isha: '#B4B4FF', // Dunkleres Violett
} as const;

interface PrayerTimesListProps {
  prayerTimes: PrayerTimes;
  nextPrayer: NextPrayer | null;
  currentTheme: PrayerTheme;
}

export const PrayerTimesList = ({ prayerTimes, nextPrayer, currentTheme }: PrayerTimesListProps) => {
  const renderPrayerTime = (name: keyof typeof PRAYER_NAMES, time: string) => {
    const isNext = nextPrayer?.name === name;
    
    return (
      <View
        key={name}
        style={[
          styles.prayerItem,
          {
            marginHorizontal: 16,
            borderWidth: isNext ? 2 : 0,
            borderColor: isNext ? PRAYER_BORDER_COLORS[name] : 'transparent',
            borderRadius: 16,
          },
        ]}
      >
        <Text style={[styles.prayerName, { color: currentTheme.text }]}>
          {PRAYER_NAMES[name]}
        </Text>
        <Text style={[styles.prayerTime, { color: currentTheme.text }]}>
          {time}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {Object.entries(prayerTimes).map(([name, time]) => 
        renderPrayerTime(name as keyof typeof PRAYER_NAMES, time)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 4,
  },
  prayerName: {
    fontSize: 20,
    fontWeight: '600',
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default PrayerTimesList; 