export interface PrayerTimes {
  [key: string]: string;
}

export interface NextPrayer {
  name: string;
  time: string;
}

export interface NotificationSetting {
  enabled: boolean;
  minutes: number;
}

export interface NotificationSettings {
  [key: string]: NotificationSetting;
}

export interface HijriDate {
  day: number;
  month: string;
  year: number;
} 