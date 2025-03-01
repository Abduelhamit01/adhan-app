import { View, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { Text, Surface, Switch, List, useTheme } from 'react-native-paper';
import { useState, useEffect, useContext } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '~/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { ThemeContext } from '~/context/ThemeContext';

const STORAGE_KEYS = {
  NOTIFICATIONS: '@settings_notifications',
  LOCATION: '@settings_location',
  DARK_MODE: '@settings_dark_mode',
  ADHAN: '@settings_adhan',
  VIBRATION: '@settings_vibration',
};

interface NotificationSettings {
  [key: string]: boolean;
}

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, setIsDarkMode, useSystemTheme, setUseSystemTheme } = useContext(ThemeContext);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    Imsak: true,
    Gunes: false,
    Ogle: true,
    Ikindi: true,
    Aksam: true,
    Yatsi: true,
  });
  const [adhanEnabled, setAdhanEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  // Get the current theme colors
  const theme = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const location = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
      const adhan = await AsyncStorage.getItem(STORAGE_KEYS.ADHAN);
      const vibration = await AsyncStorage.getItem(STORAGE_KEYS.VIBRATION);

      setLocationEnabled(location === null ? true : location === 'true');
      setAdhanEnabled(adhan === null ? true : adhan === 'true');
      setVibrationEnabled(vibration === null ? true : vibration === 'true');
      
      if (notifications) {
        setNotificationSettings(JSON.parse(notifications));
      }
    } catch (error) {
      console.error('Fehler beim Laden der Einstellungen:', error);
    }
  };

  const updateSetting = async (key: string, value: boolean, setter: (value: boolean) => void) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
      setter(value);
    } catch (error) {
      console.error('Fehler beim Speichern der Einstellung:', error);
    }
  };

  const toggleNotification = async (prayer: string) => {
    try {
      const newSettings = {
        ...notificationSettings,
        [prayer]: !notificationSettings[prayer],
      };
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(newSettings));
      setNotificationSettings(newSettings);
    } catch (error) {
      console.error('Fehler beim Speichern der Benachrichtigungseinstellungen:', error);
    }
  };

  const getPrayerName = (key: string): string => {
    const nameMap: { [key: string]: string } = {
      'Imsak': 'Fajr',
      'Gunes': 'Sunrise',
      'Ogle': 'Dhuhr',
      'Ikindi': 'Asr',
      'Aksam': 'Maghrib',
      'Yatsi': 'Isha'
    };
    return nameMap[key] || key;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <ScrollView>
        <Surface style={[styles.section, { backgroundColor: theme.surfaceVariant }]} elevation={0}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Erscheinungsbild</Text>
          
          <List.Item
            title="System-Theme verwenden"
            titleStyle={[styles.listItemTitle, { color: theme.text }]}
            style={styles.listItem}
            right={props => (
              <Switch
                {...props}
                value={useSystemTheme}
                onValueChange={(value) => {
                  setUseSystemTheme(value);
                  updateSetting('@theme_use_system', value, () => {});
                }}
                color={theme.switchColor}
              />
            )}
            left={props => (
              <MaterialCommunityIcons
                {...props}
                name="theme-light-dark"
                size={24}
                color={theme.icon}
              />
            )}
          />

          {!useSystemTheme && (
            <List.Item
              title="Dunkles Design"
              titleStyle={[styles.listItemTitle, { color: theme.text }]}
              style={styles.listItem}
              right={props => (
                <Switch
                  {...props}
                  value={isDarkMode}
                  onValueChange={(value) => {
                    setIsDarkMode(value);
                    updateSetting(STORAGE_KEYS.DARK_MODE, value, () => {});
                  }}
                  color={theme.switchColor}
                />
              )}
              left={props => (
                <MaterialCommunityIcons
                  {...props}
                  name={isDarkMode ? "weather-night" : "white-balance-sunny"}
                  size={24}
                  color={theme.icon}
                />
              )}
            />
          )}
        </Surface>

        <Surface style={[styles.section, { backgroundColor: theme.surfaceVariant }]} elevation={0}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Benachrichtigungen</Text>
          {Object.entries(notificationSettings).map(([prayer, enabled]) => (
            <List.Item
              key={prayer}
              title={getPrayerName(prayer)}
              titleStyle={[styles.listItemTitle, { color: theme.text }]}
              style={styles.listItem}
              right={props => (
                <Switch
                  {...props}
                  value={enabled}
                  onValueChange={() => toggleNotification(prayer)}
                  color={theme.switchColor}
                />
              )}
              left={props => (
                <MaterialCommunityIcons
                  {...props}
                  name="bell-outline"
                  size={24}
                  color={theme.icon}
                />
              )}
            />
          ))}
        </Surface>

        <Surface style={[styles.section, { backgroundColor: theme.surfaceVariant }]} elevation={0}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Adhan & Vibration</Text>
          <List.Item
            title="Adhan"
            description="Aktiviere Gebetsruf"
            titleStyle={[styles.listItemTitle, { color: theme.text }]}
            descriptionStyle={[styles.listItemDescription, { color: `${theme.text}99` }]}
            style={styles.listItem}
            right={props => (
              <Switch
                {...props}
                value={adhanEnabled}
                onValueChange={(value) => updateSetting(STORAGE_KEYS.ADHAN, value, setAdhanEnabled)}
                color={theme.switchColor}
              />
            )}
            left={props => (
              <MaterialCommunityIcons
                {...props}
                name="volume-high"
                size={24}
                color={theme.icon}
              />
            )}
          />
          <List.Item
            title="Vibration"
            description="Vibriere bei Gebetszeiten"
            titleStyle={[styles.listItemTitle, { color: theme.text }]}
            descriptionStyle={[styles.listItemDescription, { color: `${theme.text}99` }]}
            style={styles.listItem}
            right={props => (
              <Switch
                {...props}
                value={vibrationEnabled}
                onValueChange={(value) => updateSetting(STORAGE_KEYS.VIBRATION, value, setVibrationEnabled)}
                color={theme.switchColor}
              />
            )}
            left={props => (
              <MaterialCommunityIcons
                {...props}
                name="vibrate"
                size={24}
                color={theme.icon}
              />
            )}
          />
        </Surface>

        <Surface style={[styles.section, { backgroundColor: theme.surfaceVariant }]} elevation={0}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Standort</Text>
          <List.Item
            title="Standortdienste"
            description="Nutze Standort für genaue Gebetszeiten"
            titleStyle={[styles.listItemTitle, { color: theme.text }]}
            descriptionStyle={[styles.listItemDescription, { color: `${theme.text}99` }]}
            style={styles.listItem}
            right={props => (
              <Switch
                {...props}
                value={locationEnabled}
                onValueChange={(value) => updateSetting(STORAGE_KEYS.LOCATION, value, setLocationEnabled)}
                color={theme.switchColor}
              />
            )}
            left={props => (
              <MaterialCommunityIcons
                {...props}
                name="map-marker-outline"
                size={24}
                color={theme.icon}
              />
            )}
          />
        </Surface>

        <View style={styles.about}>
          <MaterialCommunityIcons
            name="mosque"
            size={48}
            color={theme.accent}
          />
          <Text style={[styles.aboutTitle, { color: theme.text }]}>
            Gebetszeiten App v1.0.0
          </Text>
          <Text style={[styles.copyright, { color: `${theme.text}99` }]}>
            © 2024 Alle Rechte vorbehalten
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  listItemTitle: {
    fontSize: 16,
  },
  listItemDescription: {
    fontSize: 14,
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  about: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  copyright: {
    fontSize: 14,
  },
}); 