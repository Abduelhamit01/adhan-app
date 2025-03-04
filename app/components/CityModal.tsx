import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { City } from '../types/city';
import { CITIES } from '../constants/cities';
import { useState, useMemo } from 'react';

interface CityModalProps {
  visible: boolean;
  onDismiss: () => void;
  onCitySelect: (city: City) => void;
  selectedCityId: string;
}

export const CityModal = ({ visible, onDismiss, onCitySelect, selectedCityId }: CityModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtern der Städte basierend auf der Suchanfrage
  const filteredCities = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return CITIES;

    return CITIES.filter(
      city =>
        city.name.toLowerCase().includes(query) ||
        city.country.toLowerCase().includes(query) ||
        (city.region && city.region.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Gruppierung der gefilterten Städte nach Land
  const groupedCities = useMemo(() => {
    return filteredCities.reduce((groups, city) => {
      const group = groups[city.country] || [];
      group.push(city);
      groups[city.country] = group.sort((a, b) => a.name.localeCompare(b.name));
      return groups;
    }, {} as Record<string, City[]>);
  }, [filteredCities]);

  const handleLocationDetection = async () => {
    try {
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert(
            'Standortzugriff erforderlich',
            'Bitte erlauben Sie den Zugriff auf Ihren Standort in den Einstellungen.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (geocode.length > 0) {
        const address = geocode[0];
        const cityName = address.city || address.subregion || address.region || 'Aktueller Standort';
        
        const currentCity: City = {
          id: 'current-location',
          name: cityName,
          country: address.country || 'Deutschland',
          countryCode: address.isoCountryCode || 'DE',
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          },
          region: address.region || ''
        };
        
        onCitySelect(currentCity);
        onDismiss();
      }
    } catch (error) {
      console.error('Fehler bei der Standortermittlung:', error);
      Alert.alert(
        'Fehler',
        'Der Standort konnte nicht ermittelt werden. Bitte versuchen Sie es später erneut.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} tint="dark" style={styles.blurView}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Stadt auswählen</Text>
              <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#566B85" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <MaterialCommunityIcons name="magnify" size={24} color="#566B85" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Stadt suchen..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#566B85"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                >
                  <MaterialCommunityIcons name="close-circle" size={20} color="#566B85" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.cityItem,
                'current-location' === selectedCityId && styles.selectedCityItem,
                styles.locationButton
              ]}
              onPress={handleLocationDetection}
            >
              <View style={styles.locationContent}>
                <MaterialCommunityIcons name="crosshairs-gps" size={24} color={selectedCityId === 'current-location' ? '#FFFFFF' : '#566B85'} />
                <Text style={[
                  styles.cityName,
                  'current-location' === selectedCityId && styles.selectedCityName,
                  styles.locationText
                ]}>
                  Aktueller Standort
                </Text>
              </View>
              {'current-location' === selectedCityId && (
                <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <ScrollView style={styles.cityList}>
              {Object.entries(groupedCities).map(([country, cities]) => (
                <View key={country} style={styles.countryGroup}>
                  <Text style={styles.countryHeader}>{country}</Text>
                  {cities.map((city) => (
                    <TouchableOpacity
                      key={city.id}
                      style={[
                        styles.cityItem,
                        city.id === selectedCityId && styles.selectedCityItem,
                      ]}
                      onPress={() => {
                        onCitySelect(city);
                        onDismiss();
                      }}
                    >
                      <View>
                        <Text style={[
                          styles.cityName,
                          city.id === selectedCityId && styles.selectedCityName,
                        ]}>
                          {city.name}
                        </Text>
                        {city.region && (
                          <Text style={[
                            styles.regionText,
                            city.id === selectedCityId && styles.selectedRegionText,
                          ]}>
                            {city.region}
                          </Text>
                        )}
                      </View>
                      {city.id === selectedCityId && (
                        <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 20,
    fontWeight: '600',
    color: '#566B85',
  },
  closeButton: {
    padding: 4,
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
  countryGroup: {
    marginBottom: 16,
  },
  countryHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#566B85',
    marginBottom: 8,
    paddingHorizontal: 16,
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
  regionText: {
    fontSize: 14,
    color: '#566B85',
    opacity: 0.7,
    marginTop: 2,
  },
  selectedRegionText: {
    color: '#FFFFFF',
    opacity: 0.8,
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
}); 