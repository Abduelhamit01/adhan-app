import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export const Background: React.FC = () => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <LinearGradient
        colors={['#E1EBFF', '#B7D1FF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
        locations={[0, 1]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: -1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
}); 