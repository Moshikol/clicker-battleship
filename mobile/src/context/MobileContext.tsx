import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Platform, Vibration, Dimensions } from 'react-native';
import { click, earnCoins } from '../store/gameSlice';

interface MobileContextType {
  isMobile: boolean;
  vibrate: (duration?: number) => void;
  hasVibrationSupport: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
}

const MobileContext = createContext<MobileContextType>({
  isMobile: true, // Always true for React Native
  vibrate: () => {},
  hasVibrationSupport: true,
  isIOS: false,
  isAndroid: false,
  screenWidth: 0,
  screenHeight: 0,
  orientation: 'portrait',
});

export const useMobile = () => useContext(MobileContext);

interface MobileProviderProps {
  children: ReactNode;
}

export const MobileProvider: React.FC<MobileProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    screenHeight > screenWidth ? 'portrait' : 'landscape'
  );
  
  // Platform detection
  const isIOS = Platform.OS === 'ios';
  const isAndroid = Platform.OS === 'android';

  // Handle screen dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
      setScreenHeight(window.height);
      setOrientation(window.height > window.width ? 'portrait' : 'landscape');
    });

    return () => subscription.remove();
  }, []);

  // Vibration function for haptic feedback
  const vibrate = (duration = 50) => {
    Vibration.vibrate(duration);
  };

  return (
    <MobileContext.Provider
      value={{
        isMobile: true,
        vibrate,
        hasVibrationSupport: true,
        isIOS,
        isAndroid,
        screenWidth,
        screenHeight,
        orientation,
      }}
    >
      {children}
    </MobileContext.Provider>
  );
}; 