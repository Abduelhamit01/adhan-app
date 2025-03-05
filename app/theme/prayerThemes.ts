import { PrayerTheme, PrayerThemes } from '../types/theme';

export const defaultTheme: PrayerTheme = {
  primary: '#FFFFFF',
  secondary: '#F5F5F5',
  accent: '#6366F1',
  text: '#333333'
};

export const prayerThemes: PrayerThemes = {
  Fajr: {
    primary: '#F9FAFB',
    secondary: '#F3F4F6',
    accent: '#8B5CF6',
    text: '#1F2937'
  },
  Sunrise: {
    primary: '#FEF3C7',
    secondary: '#FDE68A',
    accent: '#F59E0B',
    text: '#78350F'
  },
  Dhuhr: {
    primary: '#ECFDF5',
    secondary: '#D1FAE5',
    accent: '#10B981',
    text: '#064E3B'
  },
  Asr: {
    primary: '#EFF6FF',
    secondary: '#DBEAFE',
    accent: '#3B82F6',
    text: '#1E40AF'
  },
  Maghrib: {
    primary: '#FEF2F2',
    secondary: '#FEE2E2',
    accent: '#EF4444',
    text: '#991B1B'
  },
  Isha: {
    primary: '#F5F3FF',
    secondary: '#EDE9FE',
    accent: '#8B5CF6',
    text: '#5B21B6'
  }
}; 