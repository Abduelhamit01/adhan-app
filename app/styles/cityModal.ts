import { StyleSheet } from 'react-native';

const cityModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  blurView: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(86, 107, 133, 0.1)',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#566B85',
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: 'rgba(86, 107, 133, 0.05)',
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#566B85',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  cityList: {
    padding: 12,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: 'rgba(86, 107, 133, 0.05)',
  },
  selectedCityItem: {
    backgroundColor: '#566B85',
  },
  cityName: {
    fontSize: 16,
    color: '#566B85',
    fontWeight: '500',
  },
  selectedCityName: {
    color: '#FFFFFF',
  },
  locationButton: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#566B85',
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 10,
    color: '#566B85',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default cityModalStyles; 