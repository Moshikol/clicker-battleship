import React, { useEffect } from 'react';
import { BackHandler, Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { click, earnCoins } from '../../store/gameSlice';

interface KeyEventCaptureProps {
  enabled?: boolean;
}

/**
 * This component uses BackHandler and other available APIs to 
 * intercept hardware button presses on Android.
 * 
 * Note: In Expo managed workflow, hardware button access is limited.
 * The volume buttons specifically are not typically accessible without
 * native modules. This component provides a visible alternative.
 */
const KeyEventCapture: React.FC<KeyEventCaptureProps> = ({
  enabled = true
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return;

    // Log instructions clearly
    console.log("== Hardware Button Instructions ==");
    console.log("Press VOLUME DOWN button to increment counter");
    console.log("NOTE: Direct volume button capture requires native modules");
    console.log("Use the on-screen button to simulate the volume button");

    // On Android, we can at least capture the back button
    // This demonstrates the principle of hardware button handling
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log("Back button pressed - you could use this as an alternate trigger");
      // Return false to allow normal back button behavior
      return false;
    });

    return () => {
      backHandler.remove();
    };
  }, [enabled]);

  const handleSimulatedButtonPress = () => {
    // Increment the counters
    dispatch(click());
    dispatch(earnCoins());
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  if (!enabled || Platform.OS === 'web') return null;

  return (
    <View style={styles.container}>
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionTitle}>Volume Button Click</Text>
        <Text style={styles.instructionText}>
          Press the volume down button on your device to click.
        </Text>
        <Text style={styles.instructionNote}>
          Note: If hardware button doesn't work, use this button:
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSimulatedButtonPress}
        accessibilityLabel="Simulate Volume Button"
      >
        <Text style={styles.buttonText}>Click Here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  instructionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    maxWidth: '80%',
  },
  instructionTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  instructionNote: {
    color: '#CCCCCC',
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#666666',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default KeyEventCapture; 