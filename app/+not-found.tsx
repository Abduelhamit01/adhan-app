import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { Colors } from './constants/Colors';

export default function NotFoundScreen() {
  const { isDarkMode } = useContext(ThemeContext);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Diese Seite existiert nicht.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: theme.accent }]}>
            Zurück zur Startseite
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 16,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 