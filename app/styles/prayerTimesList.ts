import { StyleSheet } from 'react-native';

const prayerTimesListStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    opacity: 0.7,
  },
  timerValue: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: 2,
    marginBottom: 8,
    fontVariant: ['tabular-nums'],
  },
  untilText: {
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.7,
  },
  prayerListContainer: {
    marginTop: 20,
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  }
});

export default prayerTimesListStyles; 