import React, { useEffect, useState, useRef } from 'react';
import { 
  Platform, 
  View, 
  Text, 
  StyleSheet, 
  AppState, 
  TouchableOpacity, 
  Alert, 
  BackHandler,
  Keyboard,
  NativeEventEmitter,
  NativeModules,
  Dimensions
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { click, earnCoins } from '../../store/gameSlice';
import { Asset } from 'expo-asset';
import { AVPlaybackStatus } from 'expo-av/build/AV.types';
import * as Device from 'expo-device';
import * as SystemUI from 'expo-system-ui';

// Create a custom hook to detect volume button presses
const useVolumeButtonDetection = (callback: () => void) => {
  const lastTouchRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  // Effect to track screen orientation and visibility changes
  useEffect(() => {
    if (Platform.OS === 'web') return;

    // When dimensions change, it might be due to a system UI appearing
    // like the volume control panel
    const dimensionListener = Dimensions.addEventListener('change', ({ window }) => {
      const now = Date.now();
      setDimensions(window);
      
      // System UI events often happen within this timeframe
      if (now - lastTouchRef.current < 300) {
        // Likely a system UI event - volume button was probably pressed
        callback();
      }
      
      lastTouchRef.current = now;
    });
    
    // Track keyboard events as they may correlate with volume presses
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      lastTouchRef.current = Date.now();
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      const now = Date.now();
      if (now - lastTouchRef.current < 300) {
        // Quick keyboard action might correlate with volume press
        callback();
      }
    });
    
    // Clean up listeners
    return () => {
      dimensionListener.remove();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [callback]);
  
  // Return the hook data if needed
  return {
    dimensions
  };
};

interface EnhancedVolumeHandlerProps {
  enabled?: boolean;
  showDebug?: boolean;
}

/**
 * Enhanced Volume Button Handler
 * 
 * This component detects volume button presses and provides a button that simulates them
 */
const EnhancedVolumeHandler: React.FC<EnhancedVolumeHandlerProps> = ({ 
  enabled = true,
  showDebug = true 
}) => {
  const dispatch = useDispatch();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<string>("unknown");
  const [volumeButtonPresses, setVolumeButtonPresses] = useState(0);
  const lastVolumeRef = useRef<number>(1);
  const isInitializedRef = useRef<boolean>(false);
  const lastVolumeEventTimeRef = useRef<number>(0);
  const lastSystemEventRef = useRef<number>(0);
  
  // Handle volume button action
  const handleVolumeButtonPress = () => {
    try {
      // Debounce volume events
      const now = Date.now();
      if (now - lastSystemEventRef.current < 500) {
        // Too soon since last event
        return;
      }
      lastSystemEventRef.current = now;
      
      // Increment counters
      dispatch(click());
      dispatch(earnCoins());
      setVolumeButtonPresses(prev => prev + 1);
      
      // Log the event
      addDebugLog(`Volume button detected! Total: ${volumeButtonPresses + 1}`);
      
      // Provide haptic feedback
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (error) {
      console.error('Error in handleVolumeButtonPress:', error);
    }
  };
  
  // Hook up the volume detection
  useVolumeButtonDetection(handleVolumeButtonPress);
  
  // Simulate volume button press 
  const simulateVolumeButtonPress = () => {
    try {
      addDebugLog('Volume button press simulated!');
      dispatch(click());
      dispatch(earnCoins());
      setVolumeButtonPresses(prev => prev + 1);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (error) {
      console.error('Error in simulateVolumeButtonPress:', error);
    }
  };

  // Add a debug log
  const addDebugLog = (message: string) => {
    try {
      console.log(`[VolumeHandler] ${message}`);
      setDebugLogs(prev => [message, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Error in addDebugLog:', error);
    }
  };

  // Watch for AppState changes as an indicator of volume button presses
  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return;
    
    const handleAppStateChange = (nextAppState: string) => {
      // Quick return to foreground might indicate volume button press
      if (nextAppState === 'active') {
        const now = Date.now();
        const timeSinceLastEvent = now - lastVolumeEventTimeRef.current;
        
        // If it was a very quick background/foreground transition
        // This can happen with volume buttons on some Android devices
        if (timeSinceLastEvent < 300 && timeSinceLastEvent > 10) {
          addDebugLog(`Quick app state change detected: ${timeSinceLastEvent}ms - may be volume button`);
          handleVolumeButtonPress();
        }
        
        lastVolumeEventTimeRef.current = now;
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [enabled]);

  // Try to detect system events that might correlate with volume button presses
  useEffect(() => {
    let volumeTimeout: NodeJS.Timeout | null = null;
    
    // Function to poll for volume changes
    const checkVolumeChanges = async () => {
      try {
        // Here we would check system volume if possible
        // For now, mark the time for correlation with other events
        lastVolumeEventTimeRef.current = Date.now();
        
        // Continue polling
        volumeTimeout = setTimeout(checkVolumeChanges, 500);
      } catch (error) {
        console.error('Error checking volume:', error);
      }
    };
    
    // Start polling if enabled
    if (enabled && Platform.OS !== 'web') {
      volumeTimeout = setTimeout(checkVolumeChanges, 500);
    }
    
    // Clean up
    return () => {
      if (volumeTimeout) {
        clearTimeout(volumeTimeout);
      }
    };
  }, [enabled]);

  // Render a simplified UI when debug is off
  if (!showDebug) {
    return (
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={simulateVolumeButtonPress}
        accessibilityLabel="Click Button"
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    );
  }

  // Render debug UI
  return (
    <View style={styles.debugContainer}>
      <Text style={styles.debugTitle}>Clicker Button</Text>
      
      <Text style={styles.counterText}>
        Total Clicks: {volumeButtonPresses}
      </Text>
      
      <TouchableOpacity 
        style={styles.simulateButton}
        onPress={simulateVolumeButtonPress}
      >
        <Text style={styles.buttonText}>TAP TO CLICK</Text>
      </TouchableOpacity>
      
      <View style={styles.logsContainer}>
        {debugLogs.map((log, index) => (
          <Text key={index} style={styles.debugLog}>{log}</Text>
        ))}
      </View>
      
      <Text style={styles.instructionText}>
        Use the button above to click
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  debugContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
    width: '90%',
    maxWidth: 300,
    zIndex: 9999,
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
  },
  debugTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 16,
  },
  counterText: {
    color: '#FF66FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  debugStatus: {
    color: '#AAFFAA',
    fontSize: 12,
    marginBottom: 6,
  },
  logsContainer: {
    marginTop: 8,
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 4,
    maxHeight: 80,
    width: '100%',
    marginBottom: 8,
  },
  debugLog: {
    color: '#FFFFFF',
    fontSize: 10,
    marginBottom: 3,
  },
  permissionGranted: {
    color: '#4CAF50',
  },
  permissionDenied: {
    color: '#F44336',
  },
  simulateButton: {
    backgroundColor: '#E91E63',
    padding: 12,
    borderRadius: 40,
    alignItems: 'center',
    marginVertical: 12,
    width: 200,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    color: '#CCCCCC',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default EnhancedVolumeHandler; 