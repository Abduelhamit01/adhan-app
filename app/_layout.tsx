import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();
  
  const SettingsButton = () => (
    <Pressable
      onPress={() => router.push('/settings')}
      style={({ pressed }) => ({
        marginRight: 16,
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
          name="cog-outline" 
          size={22} 
          color="#566B85" 
          style={{ opacity: 0.8 }}
        />
      </BlurView>
    </Pressable>
  );

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerRight: () => <SettingsButton />,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
