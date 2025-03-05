import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { prayerTimesService } from '../services/prayerTimes.service';

// Konfiguriere die Benachrichtigungen
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const REMINDER_OPTIONS = [
  { value: 0, label: 'At time' },
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
];

interface PrayerSettings {
  enabled: boolean;
  reminderTime: number;
}

interface PrayerNotifications {
  [key: string]: PrayerSettings;
}

interface TimePickerPopupProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (minutes: number) => void;
  anchorPosition: { x: number; y: number };
}

const TimePickerPopup = ({ visible, onClose, onSelect, anchorPosition }: TimePickerPopupProps) => {
  if (!visible) return null;

  return (
    <View style={styles.timePickerContainer}>
      {REMINDER_OPTIONS.map((option) => (
        <Pressable
          key={option.value}
          style={styles.timeOption}
          onPress={() => onSelect(option.value)}
        >
          <Text style={styles.timeOptionText}>
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  globalToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  globalToggleText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  prayerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  prayerText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  chevron: {
    marginTop: 1,
  },
  itemBorder: {
    borderBottomWidth: 0,
  },
  timePickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EFEFEF',
  },
  timeOptionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [selectedPrayer, setSelectedPrayer] = useState<string | null>(null);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [prayerNotifications, setPrayerNotifications] = useState<PrayerNotifications>({
    fajr: { enabled: true, reminderTime: 0 },
    sunrise: { enabled: true, reminderTime: 0 },
    dhuhr: { enabled: true, reminderTime: 0 },
    asr: { enabled: true, reminderTime: 0 },
    maghrib: { enabled: true, reminderTime: 0 },
    isha: { enabled: true, reminderTime: 0 },
  });
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  // Separate useEffect for saving settings without triggering notifications
  useEffect(() => {
    if (isInitialLoad) return;
    
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('notificationSettings', JSON.stringify({
          enabled: enableNotifications,
          prayers: prayerNotifications,
        }));
      } catch (error) {
        // Silent error handling
      }
    };
    saveSettings();
  }, [enableNotifications, prayerNotifications]);

  // Separate useEffect for handling notification scheduling
  useEffect(() => {
    if (isInitialLoad) return;

    if (enableNotifications) {
      updateNotificationSchedule();
    } else {
      Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, [enableNotifications]);

  const loadNotificationSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      if (settings) {
        const { enabled, prayers } = JSON.parse(settings);
        setEnableNotifications(enabled);
        setPrayerNotifications(prayers);
      }
      setIsInitialLoad(false);
    } catch (error) {
      // Silent error handling in production
      setIsInitialLoad(false);
    }
  };

  const updateNotificationSchedule = async () => {
    if (isScheduling) return;
    
    try {
      setIsScheduling(true);
      
      // Cancel all existing notifications before scheduling new ones
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      if (!enableNotifications) return;

      const savedCityId = await AsyncStorage.getItem('selectedCity');
      if (!savedCityId) {
        return;
      }

      const today = new Date();
      const prayerTimes = await prayerTimesService.fetchPrayerTimes(savedCityId, today);
      
      if (!prayerTimes) {
        return;
      }

      const nextPrayer = prayerTimesService.getNextPrayer(prayerTimes);
      if (!nextPrayer) {
        return;
      }

      const prayerName = nextPrayer.name.toLowerCase();
      const prayerSettings = prayerNotifications[prayerName];
      
      if (prayerSettings && prayerSettings.enabled) {
        await schedulePrayerNotification(nextPrayer.name, prayerSettings.reminderTime, nextPrayer.time);
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setIsScheduling(false);
    }
  };

  const schedulePrayerNotification = async (prayer: string, reminderTime: number, prayerTime: string) => {
    try {
      const now = new Date();
      const [hours, minutes] = prayerTime.split(':').map(Number);
      
      // Create trigger time based on prayer time
      const trigger = new Date();
      trigger.setHours(hours, minutes, 0, 0);
      
      // Subtract reminder time
      trigger.setMinutes(trigger.getMinutes() - reminderTime);
      
      // If the time has already passed today, schedule for tomorrow
      if (trigger.getTime() <= now.getTime()) {
        trigger.setDate(trigger.getDate() + 1);
      }

      // Calculate seconds until the prayer time
      const secondsUntil = Math.max(0, Math.floor((trigger.getTime() - now.getTime()) / 1000));

      // Schedule the notification with a time interval trigger
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayer.charAt(0).toUpperCase() + prayer.slice(1)} Prayer`,
          body: reminderTime > 0 
            ? `${prayer} prayer will begin in ${reminderTime} minutes`
            : `It's time for ${prayer} prayer`,
          sound: true,
        },
        trigger: {
          seconds: secondsUntil,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL
        },
      });
    } catch (error) {
      // Silent error handling
    }
  };

  const togglePrayer = (prayer: keyof typeof prayerNotifications) => {
    setIsInitialLoad(false); // Ensure this is a user action
    setPrayerNotifications(prev => ({
      ...prev,
      [prayer]: {
        ...prev[prayer],
        enabled: !prev[prayer].enabled,
      }
    }));
  };

  const setReminderTime = (minutes: number) => {
    if (!selectedPrayer) return;
    
    setIsInitialLoad(false); // Ensure this is a user action
    setPrayerNotifications(prev => ({
      ...prev,
      [selectedPrayer]: {
        ...prev[selectedPrayer],
        reminderTime: minutes,
      }
    }));
    setTimePickerVisible(false);
    setSelectedPrayer(null);
  };

  const BackButton = () => (
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <BlurView
        intensity={60}
        tint="light"
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        <MaterialCommunityIcons 
          name="chevron-left" 
          size={24} 
          color="#566B85" 
          style={{ opacity: 0.8 }}
        />
      </BlurView>
    </Pressable>
  );

  const renderPrayerItem = (
    prayer: keyof typeof prayerNotifications,
    icon: string,
    color: string,
    bgColor: string,
    isLast: boolean = false
  ) => {
    const isEnabled = prayerNotifications[prayer].enabled && enableNotifications;
    const reminderTime = prayerNotifications[prayer].reminderTime;
    const isSelected = selectedPrayer === prayer && timePickerVisible;
    const prayerName = String(prayer);

    return (
      <View style={{ marginBottom: isLast ? 0 : 8 }}>
        <View style={[styles.notificationItem, { opacity: isEnabled ? 1 : 0.7 }]}>
          <Pressable 
            style={styles.prayerInfo}
            onPress={() => {
              if (isEnabled) {
                if (isSelected) {
                  setTimePickerVisible(false);
                  setSelectedPrayer(null);
                } else {
                  setSelectedPrayer(prayerName);
                  setTimePickerVisible(true);
                }
              }
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: isEnabled ? bgColor : '#E5E5EA' }]}>
              <Feather name={icon as any} size={20} color={isEnabled ? color : '#999'} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.prayerText, { color: isEnabled ? '#333' : '#999' }]}>
                {prayerName.charAt(0).toUpperCase() + prayerName.slice(1)}
              </Text>
              {isEnabled && (
                <View style={styles.reminderContainer}>
                  <Text style={styles.reminderText}>
                    {reminderTime === 0 ? 'At time' : `${reminderTime} min before`}
                  </Text>
                  <MaterialCommunityIcons 
                    name={isSelected ? "chevron-up" : "chevron-down"}
                    size={14} 
                    color="#8E8E93" 
                    style={styles.chevron}
                  />
                </View>
              )}
            </View>
          </Pressable>
          <Switch
            value={prayerNotifications[prayer].enabled}
            onValueChange={() => togglePrayer(prayer)}
            trackColor={{ false: '#E5E5EA', true: '#4CD964' }}
            thumbColor="#FFF"
            ios_backgroundColor="#E5E5EA"
          />
        </View>
        {isSelected && (
          <TimePickerPopup
            visible={true}
            onClose={() => {
              setTimePickerVisible(false);
              setSelectedPrayer(null);
            }}
            onSelect={setReminderTime}
            anchorPosition={anchorPosition}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={['bottom']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.globalToggle}>
          <Text style={styles.globalToggleText}>Enable Notifications</Text>
          <Switch
            value={enableNotifications}
            onValueChange={setEnableNotifications}
            trackColor={{ false: '#E5E5EA', true: '#4CD964' }}
            thumbColor="#FFF"
            ios_backgroundColor="#E5E5EA"
          />
        </View>

        {renderPrayerItem('fajr', 'sunrise', '#FF9500', '#FFF5E6')}
        {renderPrayerItem('sunrise', 'sun', '#FF3B30', '#FFEEEE')}
        {renderPrayerItem('dhuhr', 'sun', '#007AFF', '#E6F2FF')}
        {renderPrayerItem('asr', 'cloud', '#5856D6', '#EEEEFF')}
        {renderPrayerItem('maghrib', 'sunset', '#FF2D55', '#FFECF2')}
        {renderPrayerItem('isha', 'moon', '#5AC8FA', '#E6F9FF', true)}
      </ScrollView>
    </SafeAreaView>
  );
} 