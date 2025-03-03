import { StyleSheet } from 'react-native';

export const nextPrayerStyles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20
  },
  cityName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#566B85',
    textAlign: 'center',
    marginBottom: 32,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },
  prayerName: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    color: '#566B85'
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20
  },
  timeValue: {
    fontSize: 64,
    fontWeight: '600',
    color: '#566B85',
    letterSpacing: 2,
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 76
  }
}); 