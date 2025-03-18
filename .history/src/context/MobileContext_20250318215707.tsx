import React, { createContext, useContext, ReactNode, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { click, earnCoins } from '../store/gameSlice';

interface MobileContextType {
  isMobile: boolean;
  vibrate: (duration?: number) => void;
  hasVibrationSupport: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

const MobileContext = createContext<MobileContextType>({
  isMobile: false,
  vibrate: () => {},
  hasVibrationSupport: false,
  isIOS: false,
  isAndroid: false,
});

export const useMobile = () => useContext(MobileContext);

interface MobileProviderProps {
  children: ReactNode;
}

export const MobileProvider: React.FC<MobileProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [hasVibrationSupport, setHasVibrationSupport] = useState(false);
  const eventHandlersRef = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    try {
      // Check if the device is mobile and what type
      const checkMobile = () => {
        const userAgent = navigator.userAgent;
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
        const isAndroidDevice = /Android/.test(userAgent);
        
        setIsMobile(isMobileDevice);
        setIsIOS(isIOSDevice);
        setIsAndroid(isAndroidDevice);
        
        // Check for vibration support
        setHasVibrationSupport('vibrate' in navigator);
        
        // Log for debugging
        console.log('MobileProvider initialized:', {
          isMobile: isMobileDevice,
          isIOS: isIOSDevice,
          isAndroid: isAndroidDevice,
          hasVibration: 'vibrate' in navigator,
          userAgent
        });
      };

      checkMobile();

      // For Android - listen to both keydown and deviceorientation events
      const handleVolumeButtonPress = (e: KeyboardEvent) => {
        try {
          console.log('Key event detected in MobileContext:', e.key, e.keyCode, e.code);
          
          // Check for volume down key with different possible codes
          if (
            e.key === 'VolumeDown' || 
            e.keyCode === 175 || 
            e.keyCode === 174 || // Another potential code for volume down
            e.keyCode === 173 || // One more code seen on some devices
            e.code === 'AudioVolumeDown'
          ) {
            e.preventDefault(); // Prevent default browser action
            
            console.log('Volume down detected in MobileContext!');
            
            // Trigger click and earn coins actions
            dispatch(click());
            dispatch(earnCoins());
            
            // Vibrate if supported
            if (hasVibrationSupport) {
              navigator.vibrate(50);
            }
            
            return false;
          }
          
          return true;
        } catch (error) {
          console.error('Error handling volume button press:', error);
          return true;
        }
      };

      // Store the handler in a ref for cleanup
      eventHandlersRef.current.volumeButtonPress = handleVolumeButtonPress;

      // Native DOM event handler for direct hardware button events
      const handleNativeButtonEvent = (event: Event) => {
        try {
          // This works in some mobile browsers that don't properly map
          // hardware buttons to JavaScript keyboard events
          console.log('Native DOM event in MobileContext:', event.type, event);
          
          // In some environments, the event might be passed differently
          // Here we check for a property that might indicate a volume button press
          // @ts-ignore - TypeScript won't recognize these custom properties
          if (event.volumeDown || event.keyName === 'KEYCODE_VOLUME_DOWN' || event.keyCode === 25) {
            console.log('Native volume down detected in MobileContext!');
            
            // Trigger click actions
            dispatch(click());
            dispatch(earnCoins());
            
            // Vibrate if supported
            if (hasVibrationSupport) {
              navigator.vibrate(50);
            }
            
            event.preventDefault();
            return false;
          }
          
          return true;
        } catch (error) {
          console.error('Error handling native button event:', error);
          return true;
        }
      };

      // Store the handler in a ref for cleanup
      eventHandlersRef.current.nativeButtonEvent = handleNativeButtonEvent;

      // Try to capture all possible events that might be triggered by volume buttons
      const setupVolumeButtonListeners = () => {
        if (isMobile) {
          console.log('Setting up mobile event listeners in MobileContext');
          
          // Standard key events
          window.addEventListener('keydown', handleVolumeButtonPress, true);
          window.addEventListener('keyup', handleVolumeButtonPress, true);
          document.addEventListener('keydown', handleVolumeButtonPress, true);
          document.addEventListener('keyup', handleVolumeButtonPress, true);
          
          // Native DOM events that might work in some browsers
          document.addEventListener('volumedownbutton', handleNativeButtonEvent, true);
          document.addEventListener('devicebutton', handleNativeButtonEvent, true);
          document.addEventListener('hardwareButtonPressed', handleNativeButtonEvent, true);
          
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
            const playAudio = () => {
              audio.play().catch(err => console.log('Audio play error:', err));
            };
            
            // Store for cleanup
            eventHandlersRef.current.playAudio = playAudio;
            eventHandlersRef.current.audioElement = audio;
            
            document.addEventListener('click', playAudio, { once: true });
            document.addEventListener('touchstart', playAudio, { once: true });
          };
          
          setupAudioElement();
        }
      };

      setupVolumeButtonListeners();
      
    } catch (error) {
      console.error('Error in MobileProvider setup:', error);
    }

    // Clean up on unmount
    return () => {
      try {
        if (isMobile) {
          const volumeButtonHandler = eventHandlersRef.current.volumeButtonPress;
          const nativeButtonHandler = eventHandlersRef.current.nativeButtonEvent;
          const playAudioHandler = eventHandlersRef.current.playAudio;
          const audioElement = eventHandlersRef.current.audioElement;
          
          // Remove standard key event listeners
          window.removeEventListener('keydown', volumeButtonHandler, true);
          window.removeEventListener('keyup', volumeButtonHandler, true);
          document.removeEventListener('keydown', volumeButtonHandler, true);
          document.removeEventListener('keyup', volumeButtonHandler, true);
          
          // Remove native DOM event listeners
          document.removeEventListener('volumedownbutton', nativeButtonHandler, true);
          document.removeEventListener('devicebutton', nativeButtonHandler, true);
          document.removeEventListener('hardwareButtonPressed', nativeButtonHandler, true);
          
          // Clean up media session handlers
          if ('mediaSession' in navigator) {
            try {
              // @ts-ignore
              navigator.mediaSession.setActionHandler('previoustrack', null);
            } catch (error) {
              console.error('Error cleaning up media session handler:', error);
            }
          }
          
          // Clean up audio element
          if (audioElement && document.body.contains(audioElement)) {
            audioElement.pause();
            document.body.removeChild(audioElement);
            document.removeEventListener('click', playAudioHandler);
            document.removeEventListener('touchstart', playAudioHandler);
          }
          
          console.log('MobileProvider cleanup completed');
        }
      } catch (error) {
        console.error('Error in MobileProvider cleanup:', error);
      }
    };
  }, [dispatch, isMobile, hasVibrationSupport]);

  // Vibration function
  const vibrate = (duration = 100) => {
    if (hasVibrationSupport) {
      try {
        navigator.vibrate(duration);
      } catch (error) {
        console.error('Error during vibration:', error);
      }
    }
  };

  return (
    <MobileContext.Provider
      value={{
        isMobile,
        vibrate,
        hasVibrationSupport,
        isIOS,
        isAndroid,
      }}
    >
      {children}
    </MobileContext.Provider>
  );
}; 