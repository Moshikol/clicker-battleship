import React, { useEffect, useState, useRef } from 'react';
import { Platform, NativeEventEmitter, NativeModules } from 'react-native';
import { useDispatch } from 'react-redux';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { click, earnCoins } from '../../store/gameSlice';

interface HardwareVolumeHandlerProps {
  enabled?: boolean;
}

const HardwareVolumeHandler: React.FC<HardwareVolumeHandlerProps> = ({ 
  enabled = true 
}) => {
  const dispatch = useDispatch();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const lastVolumeRef = useRef<number>(1);
  const isProcessingRef = useRef<boolean>(false);
  const volumeChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return;

    let volumeInterval: NodeJS.Timeout;
    let isMounted = true;

    const setupAudio = async () => {
      try {
        // Request audio permissions
        await Audio.requestPermissionsAsync();
        
        // Set audio mode
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: false,
        });
        
        // Create a dummy sound file to track volume changes
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../../../assets/silence.mp3'),
          { volume: 1.0, isLooping: true }
        );
        
        if (isMounted) {
          setSound(newSound);
          
          // Play silently to keep audio session active
          await newSound.playAsync();
          
          // Store initial volume
          const status = await newSound.getStatusAsync();
          if ('volume' in status) {
            lastVolumeRef.current = status.volume || 1;
          }
          
          // Set up polling for volume changes
          volumeInterval = setInterval(async () => {
            if (isProcessingRef.current) return;
            
            try {
              isProcessingRef.current = true;
              const newStatus = await newSound.getStatusAsync();
              
              if ('volume' in newStatus && newStatus.volume !== undefined) {
                const newVolume = newStatus.volume;
                const previousVolume = lastVolumeRef.current;
                
                // Check for volume decrease (volume down button press)
                if (newVolume < previousVolume) {
                  // This is likely a volume down button press
                  if (volumeChangeTimeoutRef.current) {
                    clearTimeout(volumeChangeTimeoutRef.current);
                  }
                  
                  // Trigger the click
                  handleVolumeDown();
                  
                  // Optionally restore volume after a small delay
                  volumeChangeTimeoutRef.current = setTimeout(async () => {
                    try {
                      // Restore to original volume or midpoint
                      await newSound.setVolumeAsync(Math.min(previousVolume, 0.5));
                    } catch (err) {
                      console.log("Error restoring volume:", err);
                    }
                  }, 300);
                }
                
                // Update reference volume
                lastVolumeRef.current = newVolume;
              }
            } catch (error) {
              console.log("Error checking volume:", error);
            } finally {
              isProcessingRef.current = false;
            }
          }, 100);
        }
      } catch (error) {
        console.log("Error setting up audio:", error);
      }
    };
    
    // Initialize audio tracking
    setupAudio();
    
    // Additional event listener for Android hardware buttons
    if (Platform.OS === 'android') {
      // Set up additional Android-specific handlers if needed
      const backHandler = () => {
        // Can be used if needed
        return true; // Prevent default behavior
      };
      
      // Add hardware button listeners if available
      // This is a fallback approach for devices that support it
    }
    
    return () => {
      isMounted = false;
      
      // Clean up resources
      if (volumeInterval) {
        clearInterval(volumeInterval);
      }
      
      if (volumeChangeTimeoutRef.current) {
        clearTimeout(volumeChangeTimeoutRef.current);
      }
      
      if (sound) {
        sound.stopAsync().then(() => {
          sound.unloadAsync();
        }).catch(err => {
          console.log("Error unloading sound:", err);
        });
      }
    };
  }, [enabled, dispatch]);

  const handleVolumeDown = () => {
    console.log("Volume down detected - incrementing counter!");
    
    // Increment the counters
    dispatch(click());
    dispatch(earnCoins());
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  return null;
};

export default HardwareVolumeHandler; 