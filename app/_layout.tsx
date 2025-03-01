import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeContext } from './context/ThemeContext';
import { Colors } from './constants/Colors';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isDarkMode } = useContext(ThemeContext);
  
  // Angepasste Themes für React Navigation
  const navigationTheme = isDarkMode ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.dark.accent,
      background: Colors.dark.background,
    }
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.accent,
      background: Colors.light.background,
    }
  };
  
  // Angepasste Themes für React Native Paper
  const paperTheme = isDarkMode ? {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: Colors.dark.accent,
      background: Colors.dark.background,
      surface: Colors.dark.surface,
    }
  } : {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: Colors.light.accent,
      background: Colors.light.background,
      surface: Colors.light.surface,
    }
  };

  return (
    <ThemeProvider>
      <NavigationThemeProvider value={navigationTheme}>
        <PaperProvider theme={paperTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </PaperProvider>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
