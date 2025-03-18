import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { click } from '../store/gameSlice';

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

    // Handle volume button presses for mobile devices
    const handleVolumeButtonPress = (e: KeyboardEvent) => {
      // Check for volume down key (code 175 is for volume down)
      if (e.keyCode === 175 || e.key === 'VolumeDown') {
        e.preventDefault(); // Prevent default browser action
        
        // Trigger click action
        dispatch(click());
        
        // Vibrate if supported (100ms vibration)
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    };

    // Only add event listeners on mobile devices
    if (isMobile) {
      window.addEventListener('keydown', handleVolumeButtonPress);
    }

    // Clean up on unmount
    return () => {
      if (isMobile) {
        window.removeEventListener('keydown', handleVolumeButtonPress);
      }
    };
  }, [dispatch, isMobile]);

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