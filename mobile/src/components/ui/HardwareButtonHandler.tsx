import React, { useEffect } from 'react';
import { Platform, AppState, NativeEventSubscription, AppStateStatus } from 'react-native';
import { useDispatch } from 'react-redux';
import { click, earnCoins } from '../../store/gameSlice';
import * as Haptics from 'expo-haptics';

interface HardwareButtonHandlerProps {
  enabled?: boolean;
}

/**
 * This component uses a polling approach to detect volume button presses,
 * since Expo's managed workflow doesn't provide direct access to hardware buttons.
 * 
 * The approach works by looking for app state changes that might happen when a volume
 * button is pressed (e.g., the app might briefly lose focus and then regain it).
 * 
 * Note: This is not 100% reliable, as it depends on the platform's behavior,
 * and may not work the same way across all devices.
 */
const HardwareButtonHandler: React.FC<HardwareButtonHandlerProps> = ({ 
  enabled = true 
}) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return;

    let appStateSubscription: NativeEventSubscription;
    let lastAppState = AppState.currentState;
    let lastVolumeKeyPressTime = 0;

    // Use AppState to detect potential volume button presses
    appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      // Check for quick app state changes that might indicate a volume button press
      const now = Date.now();
      const isQuickStateChange = now - lastVolumeKeyPressTime < 500;
      
      if (isQuickStateChange && 
          (nextAppState === 'active' && lastAppState !== 'active')) {
        // This might be a volume button press - increment the counter
        handleVolumeButtonPress();
      }
      
      lastAppState = nextAppState;
      lastVolumeKeyPressTime = now;
    });

    return () => {
      appStateSubscription.remove();
    };
  }, [dispatch, enabled]);

  const handleVolumeButtonPress = () => {
    // Increment the counter when a volume button is pressed
    dispatch(click());
    dispatch(earnCoins());
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  // This component doesn't render anything visible
  return null;
};

export default HardwareButtonHandler; 