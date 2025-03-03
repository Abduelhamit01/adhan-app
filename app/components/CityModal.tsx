import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { City } from '../types/city';
import { CITIES } from '../constants/cities';

interface CityModalProps {
  visible: boolean;
  onDismiss: () => void;
  onCitySelect: (city: City) => void;
  selectedCityId: string;
}

export const CityModal = ({ visible, onDismiss, onCitySelect, selectedCityId }: CityModalProps) => {
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
            <ScrollView style={styles.cityList}>
              {CITIES.map((city) => (
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
                  <Text style={[
                    styles.cityName,
                    city.id === selectedCityId && styles.selectedCityName,
                  ]}>
                    {city.name}
                  </Text>
                  {city.id === selectedCityId && (
                    <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
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
}); 