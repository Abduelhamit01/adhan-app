import React from 'react';
import { View, Text } from 'react-native';
import { PrayerTimes, NextPrayer } from '../types/prayer';
import { PrayerTheme } from '../types/theme';
import prayerTimesListStyles from '../styles/prayerTimesList';

interface PrayerTimesListProps {
  prayerTimes: PrayerTimes;
  nextPrayer: NextPrayer | null;
  currentTheme: PrayerTheme & { background?: string; card?: string };
  isDark?: boolean;
  timeUntilNextPrayer?: string;
}

// Prayer-specific colors - more subtle
const PRAYER_COLORS = {
  Fajr: { 
    accent: '#8DA2FB'
  },
  Sunrise: { 
    accent: '#FBCE8D'
  },
  Dhuhr: { 
    accent: '#8DFBC5'
  },
  Asr: { 
    accent: '#8DC7FB'
  },
  Maghrib: { 
    accent: '#FB8D8D'
  },
  Isha: { 
    accent: '#C78DFB'
  }
};

export const PrayerTimesList = ({ 
  prayerTimes, 
  nextPrayer, 
  currentTheme,
  isDark = false,
  timeUntilNextPrayer = ''
}: PrayerTimesListProps) => {
  
  if (!nextPrayer) return null;
  
  // Format the time remaining in a more readable format
  const formatTimeRemaining = () => {
    if (!timeUntilNextPrayer) return '';
    
    const parts = timeUntilNextPrayer.split(':');
    if (parts.length !== 3) return timeUntilNextPrayer;
    
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Get accent color for the current prayer
  const getAccentColor = (name: string) => {
    return PRAYER_COLORS[name as keyof typeof PRAYER_COLORS]?.accent || '#AAAAAA';
  };
  
  return (
    <View style={prayerTimesListStyles.container}>
      {/* Timer display at the top */}
      <View style={prayerTimesListStyles.timerContainer}>
        <Text style={[prayerTimesListStyles.timerLabel, { color: currentTheme.text }]}>
          {nextPrayer.name} in
        </Text>
        <Text style={[prayerTimesListStyles.timerValue, { color: getAccentColor(nextPrayer.name) }]}>
          {formatTimeRemaining()}
        </Text>
        <Text style={[prayerTimesListStyles.untilText, { color: currentTheme.text }]}>
          verbleibende Zeit
        </Text>
      </View>
      
      {/* Prayer Times List */}
      <View style={prayerTimesListStyles.prayerListContainer}>
        {Object.entries(prayerTimes).map(([name, time]) => {
          const isNext = nextPrayer.name === name;
          
          return (
            <View 
              key={name}
              style={[
                prayerTimesListStyles.prayerItem,
                { 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.3)',
                  borderLeftColor: getAccentColor(name),
                  borderLeftWidth: isNext ? 4 : 0,
                }
              ]}
            >
              <Text style={[
                prayerTimesListStyles.prayerName, 
                { color: currentTheme.text },
                isNext && { fontWeight: '700' }
              ]}>
                {name}
              </Text>
              
              <Text style={[
                prayerTimesListStyles.prayerTime, 
                { color: currentTheme.text }
              ]}>
                {time}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default PrayerTimesList; 