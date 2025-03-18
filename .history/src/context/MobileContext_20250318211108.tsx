import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { click, earnCoins } from '../store/gameSlice';

interface MobileContextType {
  isMobile: boolean;
  vibrate: (duration?: number) => void;
  hasVibrationSupport: boolean;
}

const MobileContext = createContext<MobileContextType>({
  isMobile: false,
  vibrate: () => {},
  hasVibrationSupport: false,
});

export const useMobile = () => useContext(MobileContext);

interface MobileProviderProps {
  children: ReactNode;
}

export const MobileProvider: React.FC<MobileProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [hasVibrationSupport, setHasVibrationSupport] = useState(false);

  useEffect(() => {
    // Check if the device is mobile
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      
      // Check for vibration support
      setHasVibrationSupport('vibrate' in navigator);
    };

    checkMobile();

    // For Android - listen to both keydown and deviceorientation events
    const handleVolumeButtonPress = (e: KeyboardEvent) => {
      console.log('Key event detected:', e.key, e.keyCode, e.code);
      
      // Check for volume down key with different possible codes
      if (
        e.key === 'VolumeDown' || 
        e.keyCode === 175 || 
        e.keyCode === 174 || // Another potential code for volume down
        e.code === 'AudioVolumeDown'
      ) {
        e.preventDefault(); // Prevent default browser action
        
        console.log('Volume down detected!');
        
        // Trigger click and earn coins actions
        dispatch(click());
        dispatch(earnCoins());
        
        // Vibrate if supported
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    };

    // Try to capture all possible events that might be triggered by volume buttons
    const setupVolumeButtonListeners = () => {
      if (isMobile) {
        // Standard key events
        window.addEventListener('keydown', handleVolumeButtonPress, true);
        window.addEventListener('keyup', handleVolumeButtonPress, true);
        document.addEventListener('keydown', handleVolumeButtonPress, true);
        document.addEventListener('keyup', handleVolumeButtonPress, true);
        
        // Try to listen to media key events
        if ('mediaSession' in navigator) {
          // @ts-ignore - TypeScript might not recognize this API
          navigator.mediaSession.setActionHandler('previoustrack', () => {
            console.log('Media session: previous track (volume down proxy)');
            dispatch(click());
            dispatch(earnCoins());
            if (hasVibrationSupport) {
              navigator.vibrate(50);
            }
          });
        }
        
        // Set up a dummy audio element to help capture media events
        const setupAudioElement = () => {
          const audio = document.createElement('audio');
          audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
          audio.setAttribute('playsinline', '');
          audio.setAttribute('controls', '');
          audio.style.position = 'absolute';
          audio.style.top = '-9999px';
          audio.style.left = '-9999px';
          audio.volume = 0.001; // Nearly silent
          document.body.appendChild(audio);
          
          // Play it once to register for media events
          document.addEventListener('click', () => {
            audio.play().catch(err => console.log('Audio play error:', err));
          }, { once: true });
        };
        
        setupAudioElement();
      }
    };

    setupVolumeButtonListeners();

    // Clean up on unmount
    return () => {
      if (isMobile) {
        window.removeEventListener('keydown', handleVolumeButtonPress, true);
        window.removeEventListener('keyup', handleVolumeButtonPress, true);
        document.removeEventListener('keydown', handleVolumeButtonPress, true);
        document.removeEventListener('keyup', handleVolumeButtonPress, true);
        
        if ('mediaSession' in navigator) {
          // @ts-ignore
          navigator.mediaSession.setActionHandler('previoustrack', null);
        }
      }
    };
  }, [dispatch, isMobile, hasVibrationSupport]);

  // Vibration function
  const vibrate = (duration = 100) => {
    if (hasVibrationSupport) {
      navigator.vibrate(duration);
    }
  };

  return (
    <MobileContext.Provider
      value={{
        isMobile,
        vibrate,
        hasVibrationSupport,
      }}
    >
      {children}
    </MobileContext.Provider>
  );
}; 