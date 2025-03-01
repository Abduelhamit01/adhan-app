import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';

export default function TabLayout() {
  // Plattformspezifische Werte für bessere Ausrichtung
  const iconSize = 26;
  const iconContainerSize = Platform.OS === 'ios' ? 44 : 42;
  
  // Theme-Kontext für Dark Mode
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#566B85',
        tabBarInactiveTintColor: '#A3B4C8',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: Platform.OS === 'ios' ? 10 : 10,
          backgroundColor: '#F5F7FA',
          borderTopWidth: 0,
          shadowColor: '#566B85',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
          position: 'absolute',
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingTop: Platform.OS === 'ios' ? 8 : 10,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Gebetszeiten',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              width: iconContainerSize,
              height: iconContainerSize,
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: focused ? '#566B85' : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: focused ? 0.08 : 0,
              shadowRadius: 4,
              elevation: focused ? 2 : 0,
            }}>
              <MaterialCommunityIcons 
                name="mosque"
                size={iconSize} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Einstellungen',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              width: iconContainerSize,
              height: iconContainerSize,
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: focused ? '#566B85' : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: focused ? 0.08 : 0,
              shadowRadius: 4,
              elevation: focused ? 2 : 0,
            }}>
              <Ionicons 
                name={focused ? "settings" : "settings-outline"}
                size={iconSize} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
