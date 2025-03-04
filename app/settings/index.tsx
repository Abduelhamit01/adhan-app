import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useState } from 'react';

export default function SettingsScreen() {
  const router = useRouter();
  const [fastingTimer, setFastingTimer] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const BackButton = () => (
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => ({
        marginLeft: 16,
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
          name="close" 
          size={24} 
          color="#566B85" 
          style={{ opacity: 0.8 }}
        />
      </BlurView>
    </Pressable>
  );

  const navigateToNotifications = () => {
    router.push('/notifications');
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
            <Text style={styles.title}>Settings</Text>
            <View style={{ width: 36 }} />
          </View>
          <ScrollView style={styles.container}>
            {/* Time Settings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TIME SETTINGS</Text>
              <View style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <Ionicons name="sunny-outline" size={24} color="#000" />
                  <Text style={styles.settingItemText}>Fasting Timer</Text>
                </View>
                <Switch
                  value={fastingTimer}
                  onValueChange={setFastingTimer}
                  trackColor={{ false: '#E5E5EA', true: '#4F56EB' }}
                  thumbColor={'#FFFFFF'}
                  ios_backgroundColor="#E5E5EA"
                />
              </View>
            </View>

            {/* Notifications Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
              <Pressable 
                style={styles.settingItem}
                onPress={navigateToNotifications}
              >
                <View style={styles.settingItemLeft}>
                  <Ionicons name="notifications" size={24} color="#FF9500" />
                  <Text style={styles.settingItemText}>Notifications</Text>
                </View>
                <View style={styles.settingItemRight}>
                  <Text style={styles.settingItemStatus}>
                    {notificationsEnabled ? 'On' : 'Off'}
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#C7C7CC" />
                </View>
              </Pressable>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 10,
    marginLeft: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 15,
    color: '#000',
  },
  settingItemStatus: {
    fontSize: 17,
    color: '#007AFF',
    marginRight: 5,
  },
}); 