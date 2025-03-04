import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <Pressable style={styles.popupOverlay} onPress={onClose}>
      <View style={[
        styles.popupContent,
        {
          position: 'absolute',
          top: anchorPosition.y + 25,
          left: anchorPosition.x + 48,
          right: 80,
        }
      ]}>
        {REMINDER_OPTIONS.map((option, index) => (
          <Pressable
            key={option.value}
            style={[
              styles.popupOption,
              index === 0 && styles.popupOptionFirst,
              index === REMINDER_OPTIONS.length - 1 && styles.popupOptionLast,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={styles.popupOptionText}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
    </Pressable>
  );
};

export default function NotificationsScreen() {
  const router = useRouter();
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

      // Schedule the notification with type specification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayer.charAt(0).toUpperCase() + prayer.slice(1)} Prayer`,
          body: reminderTime > 0 
            ? `${prayer} prayer will begin in ${reminderTime} minutes`
            : `It's time for ${prayer} prayer`,
          sound: true,
        },
        trigger: {
          date: trigger,
          type: "timestamp"
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

  const handlePrayerPress = (prayer: string, event: any) => {
    if (!enableNotifications || !prayerNotifications[prayer].enabled) return;
    
    event.target.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      setAnchorPosition({ x: pageX, y: pageY });
      setSelectedPrayer(prayer);
      setTimePickerVisible(true);
    });
  };

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
      <View>
        <View style={[styles.notificationItem, !isLast && !isSelected && styles.itemBorder]}>
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
            <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
              <Feather name={icon as any} size={20} color={color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.prayerText, { color }]}>
                {prayerName.charAt(0).toUpperCase() + prayerName.slice(1)}
              </Text>
              {isEnabled && (
                <View style={styles.reminderContainer}>
                  <Text style={styles.reminderText}>
                    {reminderTime === 0 ? 'At time' : `${reminderTime} min`}
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
            trackColor={{ false: '#E5E5EA', true: '#4F56EB' }}
            thumbColor={'#FFFFFF'}
            ios_backgroundColor="#E5E5EA"
            disabled={!enableNotifications}
          />
        </View>
        {isSelected && (
          <View style={styles.dropdownContent}>
            {REMINDER_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={styles.dropdownOption}
                onPress={() => setReminderTime(option.value)}
              >
                <Text style={[
                  styles.dropdownOptionText,
                  option.value === reminderTime && styles.dropdownOptionTextSelected
                ]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#F7F9FC', '#F0F3F9', '#E8EDF5']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.title}>Notifications</Text>
            <View style={{ width: 36 }} />
          </View>
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              {/* Main Toggle */}
              <View style={[styles.notificationItem, styles.itemBorder]}>
                <View style={styles.prayerInfo}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="notifications" size={22} color="#4F56EB" />
                  </View>
                  <Text style={styles.notificationText}>Enable Notifications</Text>
                </View>
                <Switch
                  value={enableNotifications}
                  onValueChange={setEnableNotifications}
                  trackColor={{ false: '#E5E5EA', true: '#4F56EB' }}
                  thumbColor={'#FFFFFF'}
                  ios_backgroundColor="#E5E5EA"
                />
              </View>

              {/* Prayer Time Toggles */}
              {renderPrayerItem('fajr', 'sun', '#8E97CD', '#F3F4FF')}
              {renderPrayerItem('sunrise', 'sunrise', '#E67E22', '#FFF5EC')}
              {renderPrayerItem('dhuhr', 'sun', '#D4AC0D', '#FFFBEB')}
              {renderPrayerItem('asr', 'sun', '#E74C3C', '#FDEDEC')}
              {renderPrayerItem('maghrib', 'sunset', '#3498DB', '#EBF5FB')}
              {renderPrayerItem('isha', 'moon', '#9B59B6', '#F5EEF8', true)}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#566B85',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  notificationText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  reminderText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  chevron: {
    marginLeft: 4,
  },
  prayerText: {
    fontSize: 17,
    fontWeight: '600',
  },
  dropdownContent: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 64,
    borderTopWidth: 0.5,
    borderTopColor: '#F5F5F5',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#566B85',
    textAlign: 'left',
  },
  dropdownOptionTextSelected: {
    color: '#4F56EB',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  timeOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  timeOptionText: {
    fontSize: 17,
    color: '#007AFF',
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  popupContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  popupOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  popupOptionFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  popupOptionLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 0,
  },
  popupOptionText: {
    fontSize: 15,
    color: '#007AFF',
    textAlign: 'left',
  },
}); 