import { View, StyleSheet } from 'react-native';
import { Modal, Text, TextInput, Button } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { Colors } from '../constants/Colors';
import { NotificationSettings } from '../types/prayer';

interface NotificationModalProps {
  visible: boolean;
  onDismiss: () => void;
  prayerName: string;
  notificationSettings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
  isDarkMode: boolean;
}

export const NotificationModal = ({
  visible,
  onDismiss,
  prayerName,
  notificationSettings,
  onSave,
  isDarkMode,
}: NotificationModalProps) => {
  const [minutes, setMinutes] = useState<number>(15);

  useEffect(() => {
    if (notificationSettings[prayerName]) {
      setMinutes(notificationSettings[prayerName].minutes);
    }
  }, [prayerName, notificationSettings]);

  const handleSave = () => {
    const updatedSettings = {
      ...notificationSettings,
      [prayerName]: {
        enabled: true,
        minutes,
      },
    };
    onSave(updatedSettings);
  };

  const handleDisable = () => {
    const updatedSettings = {
      ...notificationSettings,
      [prayerName]: {
        enabled: false,
        minutes,
      },
    };
    onSave(updatedSettings);
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
        <Text variant="titleLarge" style={styles.title}>
          Benachrichtigungen für {prayerName}
        </Text>
        
        <TextInput
          mode="outlined"
          label="Minuten vor Gebetszeit"
          keyboardType="numeric"
          value={String(minutes)}
          onChangeText={(text) => setMinutes(Number(text))}
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={handleSave}
          style={styles.saveButton}
        >
          Speichern
        </Button>

        <Button 
          mode="outlined" 
          onPress={handleDisable}
          style={styles.disableButton}
        >
          Deaktivieren
        </Button>
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
  title: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  saveButton: {
    marginBottom: 12,
  },
  disableButton: {
    marginBottom: 8,
  },
}); 