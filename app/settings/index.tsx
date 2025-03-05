import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import settingsScreenStyles from '../styles/settingsScreen';

export default function SettingsScreen() {
  const router = useRouter();
  const [fastingTimer, setFastingTimer] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const BackButton = () => (
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => ({
        ...settingsScreenStyles.backButtonContainer,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <BlurView
        intensity={60}
        tint="light"
        style={settingsScreenStyles.blurContainer}
      >
        <MaterialCommunityIcons 
          name="close" 
          size={24} 
          color="#566B85" 
          style={settingsScreenStyles.iconStyle}
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
        style={settingsScreenStyles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
      >
        <SafeAreaView style={settingsScreenStyles.safeAreaContainer}>
          <StatusBar style="dark" />
          <View style={settingsScreenStyles.header}>
            <BackButton />
            <Text style={settingsScreenStyles.title}>Settings</Text>
            <View style={settingsScreenStyles.placeholderView} />
          </View>
          <ScrollView style={settingsScreenStyles.container}>
            {/* Time Settings Section */}
            <View style={settingsScreenStyles.section}>
              <Text style={settingsScreenStyles.sectionTitle}>TIME SETTINGS</Text>
              <View style={settingsScreenStyles.settingItem}>
                <View style={settingsScreenStyles.settingItemLeft}>
                  <Ionicons name="sunny-outline" size={24} color="#000" />
                  <Text style={settingsScreenStyles.settingItemText}>Fasting Timer</Text>
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
            <View style={settingsScreenStyles.section}>
              <Text style={settingsScreenStyles.sectionTitle}>NOTIFICATIONS</Text>
              <Pressable 
                style={settingsScreenStyles.settingItem}
                onPress={navigateToNotifications}
              >
                <View style={settingsScreenStyles.settingItemLeft}>
                  <Ionicons name="notifications" size={24} color="#FF9500" />
                  <Text style={settingsScreenStyles.settingItemText}>Notifications</Text>
                </View>
                <View style={settingsScreenStyles.settingItemRight}>
                  <Text style={settingsScreenStyles.settingItemStatus}>
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