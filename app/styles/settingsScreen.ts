import { StyleSheet } from 'react-native';

const settingsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#566B85',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 10,
    marginLeft: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 15,
    color: '#000',
  },
  settingItemStatus: {
    fontSize: 17,
    color: '#007AFF',
    marginRight: 5,
  },
  backButtonContainer: {
    marginLeft: 16,
  },
  blurContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconStyle: {
    opacity: 0.8,
  },
  gradientContainer: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
  },
  placeholderView: {
    width: 36,
  },
});

export default settingsScreenStyles; 