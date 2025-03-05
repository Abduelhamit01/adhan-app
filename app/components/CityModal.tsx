import { Modal, View, Text, TouchableOpacity, ScrollView, Platform, Alert, TextInput, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { City, Country, State } from '../types/city';
import { useState, useEffect } from 'react';
import { LocationService } from '../services/locationService';
import cityModalStyles from '../styles/cityModal';

interface CityModalProps {
  visible: boolean;
  onDismiss: () => void;
  onCitySelect: (city: City) => void;
  selectedCityId: string;
}

type SelectionStep = 'country' | 'state' | 'city';

export const CityModal = ({ visible, onDismiss, onCitySelect, selectedCityId }: CityModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [currentStep, setCurrentStep] = useState<SelectionStep>('country');
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locationService = LocationService.getInstance();

  // Länder laden, wenn das Modal geöffnet wird
  useEffect(() => {
    if (visible) {
      loadCountries();
    } else {
      // Reset state when modal is closed
      setCurrentStep('country');
      setSelectedCountry(null);
      setSelectedState(null);
      setSearchQuery('');
    }
  }, [visible]);

  // Bundesländer/Regionen laden, wenn ein Land ausgewählt wird
  useEffect(() => {
    if (selectedCountry) {
      loadStates(selectedCountry.name);
    }
  }, [selectedCountry]);

  // Städte laden, wenn ein Bundesland/Region ausgewählt wird
  useEffect(() => {
    if (selectedCountry && selectedState) {
      loadCities(selectedCountry.name, selectedState.name);
    }
  }, [selectedCountry, selectedState]);

  const loadCountries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await locationService.getCountries();
      setCountries(data);
    } catch (err) {
      setError('Fehler beim Laden der Länder');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStates = async (countryName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await locationService.getStates(countryName);
      setStates(data);
    } catch (err) {
      setError(`Fehler beim Laden der Regionen für ${countryName}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCities = async (countryName: string, stateName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await locationService.getCities(countryName, stateName);
      setCities(data);
    } catch (err) {
      setError(`Fehler beim Laden der Städte für ${stateName}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'city') {
      setCurrentStep('state');
      setSearchQuery('');
    } else if (currentStep === 'state') {
      setCurrentStep('country');
      setSelectedCountry(null);
      setSearchQuery('');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await locationService.searchLocations(searchQuery);
      
      if (results.length === 0) {
        setError('Keine Ergebnisse gefunden');
        return;
      }
      
      // Gruppieren nach Ländern
      const countriesMap = new Map<string, Country>();
      
      results.forEach(location => {
        if (!countriesMap.has(location.country)) {
          countriesMap.set(location.country, {
            id: location.country.toLowerCase().replace(/\s+/g, '-'),
            name: location.country,
            code: '',
            states: []
          });
        }
      });
      
      setCountries(Array.from(countriesMap.values()));
      
      // Wenn nur ein Land gefunden wurde, automatisch auswählen
      if (countriesMap.size === 1) {
        const country = Array.from(countriesMap.values())[0];
        setSelectedCountry(country);
        setCurrentStep('state');
        
        // Gruppieren nach Bundesländern/Regionen für dieses Land
        const statesMap = new Map<string, State>();
        
        results
          .filter(loc => loc.country === country.name)
          .forEach(location => {
            if (!statesMap.has(location.city)) {
              statesMap.set(location.city, {
                id: location.city.toLowerCase().replace(/\s+/g, '-'),
                name: location.city,
                cities: []
              });
            }
          });
        
        setStates(Array.from(statesMap.values()));
        
        // Wenn nur ein Bundesland/Region gefunden wurde, automatisch auswählen
        if (statesMap.size === 1) {
          const state = Array.from(statesMap.values())[0];
          setSelectedState(state);
          setCurrentStep('city');
          
          // Städte für dieses Bundesland/Region
          const citiesList = results
            .filter(loc => loc.country === country.name && loc.city === state.name)
            .map(location => ({
              id: location.id.toString(),
              name: location.region,
              country: location.country,
              countryCode: '',
              state: location.city,
              coordinates: { latitude: 0, longitude: 0 }
            }));
          
          setCities(citiesList);
        }
      }
    } catch (err) {
      setError('Fehler bei der Suche');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
          state: address.region || '',
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
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

  const renderTitle = () => {
    if (currentStep === 'country') return 'Land auswählen';
    if (currentStep === 'state') return selectedCountry?.name || 'Bundesland auswählen';
    return selectedState?.name || 'Stadt auswählen';
  };

  const getFilteredItems = () => {
    const query = searchQuery.toLowerCase().trim();
    
    if (currentStep === 'country') {
      return countries.filter(country => 
        !query || country.name.toLowerCase().includes(query)
      );
    }
    
    if (currentStep === 'state') {
      return states.filter(state => 
        !query || state.name.toLowerCase().includes(query)
      );
    }
    
    if (currentStep === 'city') {
      return cities.filter(city => 
        !query || city.name.toLowerCase().includes(query)
      );
    }
    
    return [];
  };

  // Render nur den aktuellen Schritt
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={cityModalStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#566B85" />
          <Text style={cityModalStyles.loadingText}>Laden...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={cityModalStyles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#566B85" />
          <Text style={cityModalStyles.errorText}>{error}</Text>
        </View>
      );
    }
    
    const items = getFilteredItems();
    
    if (items.length === 0) {
      return (
        <View style={cityModalStyles.errorContainer}>
          <Text style={cityModalStyles.errorText}>Keine Ergebnisse gefunden</Text>
        </View>
      );
    }
    
    return (
      <ScrollView style={cityModalStyles.cityList}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              cityModalStyles.cityItem,
              currentStep === 'city' && item.id === selectedCityId && cityModalStyles.selectedCityItem,
            ]}
            onPress={() => {
              if (currentStep === 'country') {
                setSelectedCountry(item as Country);
                setCurrentStep('state');
                setSearchQuery('');
              } else if (currentStep === 'state') {
                setSelectedState(item as State);
                setCurrentStep('city');
                setSearchQuery('');
              } else {
                onCitySelect(item as City);
                onDismiss();
              }
            }}
          >
            <Text style={[
              cityModalStyles.cityName,
              currentStep === 'city' && item.id === selectedCityId && cityModalStyles.selectedCityName,
            ]}>
              {item.name}
            </Text>
            {currentStep === 'city' && item.id === selectedCityId ? (
              <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
            ) : (
              currentStep !== 'city' && <MaterialCommunityIcons name="chevron-right" size={24} color="#566B85" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={cityModalStyles.modalOverlay}>
        <BlurView intensity={20} tint="dark" style={cityModalStyles.blurView}>
          <View style={cityModalStyles.modalContent}>
            <View style={cityModalStyles.header}>
              {currentStep !== 'country' && (
                <TouchableOpacity onPress={handleBack} style={cityModalStyles.backButton}>
                  <MaterialCommunityIcons name="arrow-left" size={24} color="#566B85" />
                </TouchableOpacity>
              )}
              <Text style={cityModalStyles.title}>{renderTitle()}</Text>
              <TouchableOpacity onPress={onDismiss} style={cityModalStyles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#566B85" />
              </TouchableOpacity>
            </View>

            <View style={cityModalStyles.searchContainer}>
              <MaterialCommunityIcons name="magnify" size={24} color="#566B85" style={cityModalStyles.searchIcon} />
              <TextInput
                style={cityModalStyles.searchInput}
                placeholder={`${currentStep === 'country' ? 'Land' : currentStep === 'state' ? 'Bundesland' : 'Stadt'} suchen...`}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                placeholderTextColor="#566B85"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={cityModalStyles.clearButton}
                >
                  <MaterialCommunityIcons name="close-circle" size={20} color="#566B85" />
                </TouchableOpacity>
              )}
            </View>

            {currentStep === 'country' && (
              <TouchableOpacity
                style={[
                  cityModalStyles.cityItem,
                  'current-location' === selectedCityId && cityModalStyles.selectedCityItem,
                  cityModalStyles.locationButton
                ]}
                onPress={handleLocationDetection}
              >
                <View style={cityModalStyles.locationContent}>
                  <MaterialCommunityIcons name="crosshairs-gps" size={24} color={selectedCityId === 'current-location' ? '#FFFFFF' : '#566B85'} />
                  <Text style={[
                    cityModalStyles.cityName,
                    'current-location' === selectedCityId && cityModalStyles.selectedCityName,
                    cityModalStyles.locationText
                  ]}>
                    Aktueller Standort
                  </Text>
                </View>
                {'current-location' === selectedCityId && (
                  <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            )}

            {renderContent()}
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

export default CityModal; 