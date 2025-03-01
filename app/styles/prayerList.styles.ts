import { StyleSheet } from 'react-native';

export const prayerListStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: '20%'
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 2
  },
  prayerName: {
    fontSize: 17,
    fontWeight: '400',
    color: '#566B85',
    letterSpacing: 0.3
  },
  prayerTime: {
    fontSize: 17,
    fontWeight: '400',
    color: '#566B85',
    letterSpacing: 0.3
  },
  activePrayerItem: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#93B5FF',
    borderRadius: 12,
    marginVertical: 2,
    paddingVertical: 16,
    paddingHorizontal: 16
  }
}); 