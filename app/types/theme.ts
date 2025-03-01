export interface AppTheme {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  accent: string;
  surface: string;
}

export interface PrayerTheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export interface PrayerThemes {
  [key: string]: PrayerTheme;
} 