import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface NotificationModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAllow: () => void;
}

export const NotificationModal = ({
  visible,
  onDismiss,
  onAllow,
}: NotificationModalProps) => {
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
            <MaterialCommunityIcons name="bell-outline" size={48} color="#566B85" />
            <Text style={styles.title}>Benachrichtigungen</Text>
            <Text style={styles.description}>
              Erlaube Benachrichtigungen, um keine Gebetszeit zu verpassen
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onDismiss} style={[styles.button, styles.cancelButton]}>
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Später</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onAllow} style={[styles.button, styles.allowButton]}>
                <Text style={[styles.buttonText, styles.allowButtonText]}>Erlauben</Text>
              </TouchableOpacity>
            </View>
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
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    width: 320,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#566B85',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#566B85',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 120,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F3F9',
  },
  cancelButtonText: {
    color: '#566B85',
  },
  allowButton: {
    backgroundColor: '#566B85',
  },
  allowButtonText: {
    color: '#FFFFFF',
  },
}); 