import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Modal, Searchbar, List } from 'react-native-paper';
import { useState } from 'react';
import { Colors } from '../constants/Colors';
import { City } from '../services/citySearch';

interface CityModalProps {
  visible: boolean;
  onDismiss: () => void;
  onCitySelect: (city: City) => void;
  isDarkMode: boolean;
}

export const CityModal = ({ visible, onDismiss, onCitySelect, isDarkMode }: CityModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [cities, setCities] = useState<City[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setCities([]);
      return;
    }
    setIsSearching(true);
    
    // Mock cities for demo
    const mockCities: City[] = [
      { 
        id: '1', 
        name: 'Frankfurt am Main',
        country: 'Deutschland',
        countryCode: 'DE',
        coordinates: { latitude: 50.1109, longitude: 8.6821 }
      },
      { 
        id: '2', 
        name: 'Frankfurt (Oder)',
        country: 'Deutschland',
        countryCode: 'DE',
        coordinates: { latitude: 52.3472, longitude: 14.5506 }
      },
      // Add more cities as needed
    ].filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setTimeout(() => {
      setCities(mockCities);
      setIsSearching(false);
    }, 500);
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }
      ]}
    >
      <View style={styles.content}>
        <Searchbar
          placeholder="Stadt suchen"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
        {isSearching ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <ScrollView style={styles.list}>
            {cities.map((city) => (
              <List.Item
                key={city.id}
                title={city.name}
                description={city.country}
                onPress={() => onCitySelect(city)}
                style={styles.listItem}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  searchbar: {
    marginBottom: 16,
    elevation: 0,
  },
  loader: {
    marginTop: 20,
  },
  list: {
    maxHeight: 400,
  },
  listItem: {
    borderRadius: 8,
  },
}); 