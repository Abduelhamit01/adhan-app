import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useState } from 'react';

export default function NotificationsScreen() {
  const router = useRouter();
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [prayerNotifications, setPrayerNotifications] = useState({
    fajr: true,
    sunrise: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  });

  const togglePrayer = (prayer: keyof typeof prayerNotifications) => {
    setPrayerNotifications(prev => ({
      ...prev,
      [prayer]: !prev[prayer]
    }));
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
            {/* Main Toggle */}
            <View style={[styles.card, styles.mainToggle]}>
              <View style={styles.notificationItem}>
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
            </View>

            {/* Prayer Time Toggles */}
            <View style={styles.card}>
              {/* Fajr */}
              <View style={[styles.notificationItem, styles.itemBorder]}>
                <View style={styles.prayerInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: '#F3F4FF' }]}>
                    <Feather name="sun" size={20} color="#8E97CD" />
                  </View>
                  <Text style={[styles.prayerText, { color: '#8E97CD' }]}>Fajr</Text>
                </View>
                <Switch
                  value={prayerNotifications.fajr}
                  onValueChange={() => togglePrayer('fajr')}
                  trackColor={{ false: '#E5E5EA', true: '#4F56EB' }}
                  thumbColor={'#FFFFFF'}
                  ios_backgroundColor="#E5E5EA"
                  disabled={!enableNotifications}
                />
              </View>

              {/* Sunrise */}
              <View style={[styles.notificationItem, styles.itemBorder]}>
                <View style={styles.prayerInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: '#FFF5EC' }]}>
                    <Feather name="sunrise" size={20} color="#E67E22" />
                  </View>
                  <Text style={[styles.prayerText, { color: '#E67E22' }]}>Sunrise</Text>
                </View>
                <Switch
                  value={prayerNotifications.sunrise}
                  onValueChange={() => togglePrayer('sunrise')}
                  trackColor={{ false: '#E5E5EA', true: '#4F56EB' }}
                  thumbColor={'#FFFFFF'}
                  ios_backgroundColor="#E5E5EA"
                  disabled={!enableNotifications}
                />
              </View>

              {/* Dhuhr */}
              <View style={[styles.notificationItem, styles.itemBorder]}>
                <View style={styles.prayerInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: '#FFFBEB' }]}>
                    <Feather name="sun" size={20} color="#D4AC0D" />
                  </View>
                  <Text style={[styles.prayerText, { color: '#D4AC0D' }]}>Dhuhr</Text>
                </View>
                <Switch
                  value={prayerNotifications.dhuhr}
                  onValueChange={() => togglePrayer('dhuhr')}
                  trackColor={{ false: '#E5E5EA', true: '#4F56EB' }}
                  thumbColor={'#FFFFFF'}
                  ios_backgroundColor="#E5E5EA"
                  disabled={!enableNotifications}
                />
              </View>

              {/* Asr */}
              <View style={[styles.notificationItem, styles.itemBorder]}>
                <View style={styles.prayerInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: '#FDEDEC' }]}>
                    <Feather name="sun" size={20} color="#E74C3C" />
                  </View>
                  <Text style={[styles.prayerText, { color: '#E74C3C' }]}>Asr</Text>
                </View>
                <Switch
                  value={prayerNotifications.asr}
                  onValueChange={() => togglePrayer('asr')}
                  trackColor={{ false: '#E5E5EA', true: '#4F56EB' }}
                  thumbColor={'#FFFFFF'}
                  ios_backgroundColor="#E5E5EA"
                  disabled={!enableNotifications}
                />
              </View>

              {/* Maghrib */}
              <View style={[styles.notificationItem, styles.itemBorder]}>
                <View style={styles.prayerInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: '#EBF5FB' }]}>
                    <Feather name="sunset" size={20} color="#3498DB" />
                  </View>
                  <Text style={[styles.prayerText, { color: '#3498DB' }]}>Maghrib</Text>
                </View>
                <Switch
                  value={prayerNotifications.maghrib}
                  onValueChange={() => togglePrayer('maghrib')}
                  trackColor={{ false: '#E5E5EA', true: '#4F56EB' }}
                  thumbColor={'#FFFFFF'}
                  ios_backgroundColor="#E5E5EA"
                  disabled={!enableNotifications}
                />
              </View>

              {/* Isha */}
              <View style={styles.notificationItem}>
                <View style={styles.prayerInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: '#F5EEF8' }]}>
                    <Feather name="moon" size={20} color="#9B59B6" />
                  </View>
                  <Text style={[styles.prayerText, { color: '#9B59B6' }]}>Isha</Text>
                </View>
                <Switch
                  value={prayerNotifications.isha}
                  onValueChange={() => togglePrayer('isha')}
                  trackColor={{ false: '#E5E5EA', true: '#4F56EB' }}
                  thumbColor={'#FFFFFF'}
                  ios_backgroundColor="#E5E5EA"
                  disabled={!enableNotifications}
                />
              </View>
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
  mainToggle: {
    marginBottom: 16,
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
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F1FF',
  },
  prayerText: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 12,
  },
}); 