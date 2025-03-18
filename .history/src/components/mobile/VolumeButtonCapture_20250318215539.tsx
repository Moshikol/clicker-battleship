import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { click, earnCoins } from '../../store/gameSlice';
import { useMobile } from '../../context/MobileContext';
import { 
  initAudioContext, 
  initMediaElement, 
  createCaptureOverlay, 
  isIOS, 
  isAndroid 
} from '../../utils/mobileBrowserHack';

// This component captures volume button events on mobile devices
const VolumeButtonCapture: React.FC = () => {
  const dispatch = useDispatch();
  const { isMobile, vibrate } = useMobile();
  // Use refs to avoid unnecessary re-renders
  const systemRef = useRef<any>(null);
  const handlersRef = useRef<{ [key: string]: any }>({});
  
  useEffect(() => {
    if (!isMobile) return;
    
    try {
      // Log device information for debugging
      console.log('Mobile device detected:', {
        isIOS: isIOS(),
        isAndroid: isAndroid(),
        userAgent: navigator.userAgent
      });
      
      // Add event listener for volume button press
      const handleKeyDown = (e: KeyboardEvent) => {
        try {
          // iOS: 175 for volume down, 174 for volume up
          // Android: may use different codes including VolumeDown string
          // We need to check for multiple possible codes
          const volumeDownCodes = [173, 174, 175, 176, 'VolumeDown', 'volumedown'];
          
          console.log('VolumeButtonCapture: Key event:', e.type, e.key, e.keyCode, e.code);
          
          // Check if the event is a volume down event
          const isVolumeDown = volumeDownCodes.includes(e.keyCode as any) || 
                              volumeDownCodes.includes(e.key as any) || 
                              e.code === 'VolumeDown' || 
                              e.code === 'AudioVolumeDown';
          
          if (isVolumeDown) {
            console.log('VolumeButtonCapture: Volume Down detected!');
            e.preventDefault();
            e.stopPropagation();
            
            // Trigger click and earn coins actions
            dispatch(click());
            dispatch(earnCoins());
            
            // Vibrate for feedback
            vibrate(50);
            
            return false;
          }
          
          return true;
        } catch (error) {
          console.error('Error in key event handler:', error);
          return true;
        }
      };
      
      // Store the handler in the ref so we can access it during cleanup
      handlersRef.current.keyDown = handleKeyDown;
      
      // This function initializes all the necessary hacks to capture volume buttons
      const initMobileCaptureSystem = () => {
        try {
          // Create an invisible overlay to help capture events
          const overlay = createCaptureOverlay();
          
          // Initialize audio context (helps with volume events on some devices)
          const audioContext = initAudioContext();
          
          // Initialize media element (helps with media events on iOS)
          const mediaElement = initMediaElement();
          
          // Register various event listeners with capture phase for maximum compatibility
          window.addEventListener('keydown', handleKeyDown, { capture: true });
          window.addEventListener('keyup', handleKeyDown, { capture: true });
          document.addEventListener('keydown', handleKeyDown, { capture: true });
          document.addEventListener('keyup', handleKeyDown, { capture: true });
          
          if (overlay) {
            overlay.addEventListener('keydown', handleKeyDown, { capture: true });
            overlay.addEventListener('keyup', handleKeyDown, { capture: true });
          }
          
          // For devices that use MediaSession (some Android devices)
          if ('mediaSession' in navigator) {
            try {
              // Setup previous track handler (often triggered by volume down + power)
              // @ts-ignore - TypeScript might not recognize MediaSession API
              navigator.mediaSession.setActionHandler('previoustrack', () => {
                console.log('MediaSession: Previous track event detected (volume proxy)');
                dispatch(click());
                dispatch(earnCoins());
                vibrate(50);
              });
              
              // Setup next track handler (volume up + power on some Android phones)
              // @ts-ignore
              navigator.mediaSession.setActionHandler('nexttrack', () => {
                console.log('MediaSession: Next track event detected (volume proxy)');
                dispatch(click());
                dispatch(earnCoins());
                vibrate(50);
              });
            } catch (error) {
              console.error('MediaSession error:', error);
            }
          }
          
          return {
            audioContext,
            mediaElement,
            overlay
          };
        } catch (error) {
          console.error('Error initializing mobile capture system:', error);
          return { audioContext: null, mediaElement: null, overlay: null };
        }
      };
      
      // Initialize the system
      systemRef.current = initMobileCaptureSystem();
    } catch (error) {
      console.error('Error in VolumeButtonCapture setup:', error);
    }
    
    // Clean up function
    return () => {
      try {
        const system = systemRef.current;
        const savedHandler = handlersRef.current.keyDown;
        if (!system) return;

        // Remove event listeners
        window.removeEventListener('keydown', savedHandler, { capture: true });
        window.removeEventListener('keyup', savedHandler, { capture: true });
        document.removeEventListener('keydown', savedHandler, { capture: true });
        document.removeEventListener('keyup', savedHandler, { capture: true });
        
        // Clean up overlay
        if (system.overlay) {
          system.overlay.removeEventListener('keydown', savedHandler, { capture: true });
          system.overlay.removeEventListener('keyup', savedHandler, { capture: true });
          
          if (document.body.contains(system.overlay)) {
            document.body.removeChild(system.overlay);
          }
        }
        
        // Clean up audio context
        if (system.audioContext) {
          system.audioContext.cleanup();
        }
        
        // Clean up media element
        if (system.mediaElement) {
          system.mediaElement.cleanup();
        }
        
        // Clean up media session handlers
        if ('mediaSession' in navigator) {
          try {
            // @ts-ignore
            navigator.mediaSession.setActionHandler('previoustrack', null);
            // @ts-ignore
            navigator.mediaSession.setActionHandler('nexttrack', null);
          } catch (error) {
            console.error('MediaSession cleanup error:', error);
          }
        }
      } catch (error) {
        console.error('Error in VolumeButtonCapture cleanup:', error);
      }
    };
  }, [isMobile, dispatch, vibrate]);
  
  // This component doesn't render anything visible
  return null;
};

export default VolumeButtonCapture; 