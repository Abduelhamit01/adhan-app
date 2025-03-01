import { View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Text, Surface, useTheme, Portal } from 'react-native-paper';
import { useState, useEffect, useContext, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, addDays, subDays } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import * as HijriConverter from 'hijri-converter';

// Components
import { Header } from '../components/Header';
import { NextPrayerCountdown } from '../components/NextPrayerCountdown';
import { PrayerTimesList } from '../components/PrayerTimesList';
import { CityModal } from '../components/CityModal';
import { NotificationModal } from '../components/NotificationModal';

// Types
import { PrayerTimes, NextPrayer, NotificationSettings } from '../types/prayer';
import { City } from '../types/city';

// Context
import { ThemeContext } from '../context/ThemeContext';

// Constants
import { Colors } from '../constants/Colors';

// Services
import { prayerTimesService } from '../services/prayerTimes.service';

// Styles
import { homeStyles } from '../styles/home.styles';

// Theme
import { defaultTheme, prayerThemes } from '../theme/prayerThemes';

// Utils
import { getEnglishName, toHijri } from '../utils/dateUtils';

export default function HomeScreen() {
  // ... Rest of the component implementation remains the same ...
} 