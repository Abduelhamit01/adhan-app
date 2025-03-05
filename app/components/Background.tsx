import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

interface BackgroundProps {
  colors?: [string, string];
}

export const Background: React.FC<BackgroundProps> = ({ colors = ['#FFFFFF', '#F5F5F5'] }) => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <LinearGradient
        colors={colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
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

export default Background; 