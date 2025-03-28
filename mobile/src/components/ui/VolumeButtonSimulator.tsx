import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { click, earnCoins } from '../../store/gameSlice';
import { colors, shadows } from '../../styles/theme';

interface VolumeButtonSimulatorProps {
  visible?: boolean;
}

const VolumeButtonSimulator: React.FC<VolumeButtonSimulatorProps> = ({
  visible = true
}) => {
  const dispatch = useDispatch();

  const handlePress = () => {
    // Increment the counter
    dispatch(click());
    dispatch(earnCoins());
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        accessibilityLabel="Volume Button Simulator"
      >
        <Ionicons name="volume-low" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 999,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444444',
    ...shadows.medium,
  },
});

export default VolumeButtonSimulator; 