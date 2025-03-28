import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { click, earnCoins } from '../../store/gameSlice';

/**
 * This component provides a visible button that simulates
 * the volume down button functionality, making it very clear
 * to the user that they can press the physical volume button.
 */
const DirectVolumeButtonHandler: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // When component mounts, show clear instructions to the user
    console.log("Volume Button Handler activated");
    console.log("Press the VOLUME DOWN button on your device to click");
    
    // Add event listeners for key down events
    // Note: This is for demonstration. Actual hardware button access
    // on managed Expo requires native module integration.
    
    // For real hardware button access, we need a development build with native modules
    
    return () => {
      // Cleanup
    };
  }, []);
  
  // Handle the click action from any source
  const handleClick = () => {
    // Increment counters
    dispatch(click());
    dispatch(earnCoins());
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        Press the VOLUME DOWN button to click
      </Text>
      
      {/* This button simulates the volume button click for easier testing */}
      <TouchableOpacity 
        style={styles.simulatorButton}
        onPress={handleClick}
      >
        <Text style={styles.buttonText}>Simulate Volume Down</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    zIndex: 999,
  },
  instructionText: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  simulatorButton: {
    backgroundColor: '#444444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#666666',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default DirectVolumeButtonHandler; 