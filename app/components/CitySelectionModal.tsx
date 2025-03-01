import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { CITIES } from '../constants/cities';
import { City } from '../types/city';

interface CitySelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCity: (city: City) => void;
  selectedCityId: string;
}

export const CitySelectionModal: React.FC<CitySelectionModalProps> = ({
  visible,
  onClose,
  onSelectCity,
  selectedCityId
}) => {
  const handleLocationDetection = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({});
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses && addresses.length > 0) {
        const cityName = addresses[0].city || addresses[0].subregion || 'Unbekannter Ort';
        const newCity: City = {
          id: `loc_${location.coords.latitude}_${location.coords.longitude}`,
          name: cityName,
          country: 'Deutschland',
          countryCode: 'DE',
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        };
        onSelectCity(newCity);
        onClose();
      }
    } catch (error) {
      console.error('Error detecting location:', error);
    }
  };

  const renderCity = ({ item }: { item: City }) => (
    <TouchableOpacity
      style={[
        styles.cityItem,
        item.id === selectedCityId && styles.selectedCityItem
      ]}
      onPress={() => {
        onSelectCity(item);
        onClose();
      }}
    >
      <Text style={[
        styles.cityName,
        item.id === selectedCityId && styles.selectedCityName
      ]}>
        {item.name}
      </Text>
      {item.id === selectedCityId && (
        <MaterialCommunityIcons name="check" size={24} color="#566B85" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Stadt auswählen</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#566B85" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={handleLocationDetection}
          >
            <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#566B85" />
            <Text style={styles.locationButtonText}>Aktuellen Standort verwenden</Text>
          </TouchableOpacity>

          <FlatList
            data={CITIES}
            renderItem={renderCity}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#566B85'
  },
  closeButton: {
    padding: 8
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#F7F9FC',
    borderRadius: 12
  },
  locationButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#566B85'
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  selectedCityItem: {
    backgroundColor: '#F7F9FC'
  },
  cityName: {
    fontSize: 16,
    color: '#566B85'
  },
  selectedCityName: {
    fontWeight: '500'
  }
}); 