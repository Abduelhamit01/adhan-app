import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

export default function SettingsScreen() {
  const router = useRouter();

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
          name="chevron-left" 
          size={28} 
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
      >
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.title}>Einstellungen</Text>
          </View>
          <ScrollView style={styles.container}>
            {/* Hier können weitere Einstellungen hinzugefügt werden */}
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
    paddingVertical: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#566B85',
    marginLeft: 16,
  },
}); 