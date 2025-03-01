import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
  },
  qiblaButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  prayerListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  prayerListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  activePrayerItem: {
    borderRadius: 12,
  },
  prayerIconName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  prayerListName: {
    fontSize: 16,
    fontWeight: '500',
  },
  prayerTimeNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prayerListTime: {
    fontSize: 16,
    fontWeight: '500',
  },
  ramadanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  ramadanTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ramadanTimeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  countdownCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  countdownGradient: {
    padding: 16,
  },
  nextPrayerInfo: {
    marginBottom: 8,
  },
  nextPrayerName: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  countdownText: {
    fontSize: 24,
    fontWeight: '700',
  },
}); 