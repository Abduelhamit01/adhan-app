import * as HijriConverter from 'hijri-converter';
import { HijriDate } from '../types/prayer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const getEnglishName = (name: string) => {
  const nameMap: { [key: string]: string } = {
    'Imsak': 'Fajr',
    'Güneş': 'Sunrise',
    'Öğle': 'Dhuhr',
    'İkindi': 'Asr',
    'Akşam': 'Maghrib',
    'Yatsı': 'Isha'
  };
  return nameMap[name] || name;
};

export const getPrayerIcon = (prayerName: string): keyof typeof MaterialCommunityIcons.glyphMap => {
  const normalizedName = prayerName.toLowerCase();
  
  if (normalizedName.includes('fajr') || normalizedName.includes('imsak')) {
    return 'weather-sunset-up';
  }
  if (normalizedName.includes('sunrise') || normalizedName.includes('güneş') || normalizedName.includes('gunes')) {
    return 'weather-sunny';
  }
  if (normalizedName.includes('dhuhr') || normalizedName.includes('öğle') || normalizedName.includes('ogle')) {
    return 'weather-sunny';
  }
  if (normalizedName.includes('asr') || normalizedName.includes('ikindi')) {
    return 'weather-partly-cloudy';
  }
  if (normalizedName.includes('maghrib') || normalizedName.includes('akşam') || normalizedName.includes('aksam')) {
    return 'weather-sunset-down';
  }
  if (normalizedName.includes('isha') || normalizedName.includes('yatsı') || normalizedName.includes('yatsi')) {
    return 'weather-night';
  }
  if (normalizedName.includes('suhoor')) {
    return 'food-outline';
  }
  if (normalizedName.includes('iftar')) {
    return 'food';
  }
  
  return 'clock-outline';
};

export const getIslamicMonth = (date: Date): number => {
  const hijriDate = HijriConverter.toHijri(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return hijriDate.hm;
};

export const toHijri = (date: Date): HijriDate => {
  const hijriDate = HijriConverter.toHijri(date.getFullYear(), date.getMonth() + 1, date.getDate());
  
  const islamicMonths = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
  ];
  
  return {
    day: hijriDate.hd,
    month: islamicMonths[hijriDate.hm - 1],
    year: hijriDate.hy
  };
}; 