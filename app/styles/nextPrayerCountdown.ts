import { StyleSheet } from 'react-native';

const nextPrayerCountdownStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    marginBottom: 8,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qiblaButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qiblaContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qiblaIcon: {
    width: 20,
    height: 20,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  settingsPlaceholder: {
    width: 40,
    height: 40,
  }
});

export default nextPrayerCountdownStyles; 