import React, { useEffect } from 'react';
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
  
  useEffect(() => {
    if (!isMobile) return;
    
    // Log device information for debugging
    console.log('Mobile device detected:', {
      isIOS: isIOS(),
      isAndroid: isAndroid(),
      userAgent: navigator.userAgent
    });
    
    // Add event listener for volume button press
    const handleKeyDown = (e: KeyboardEvent) => {
      // iOS: 175 for volume down, 174 for volume up
      // Android: may use different codes including VolumeDown string
      // We need to check for multiple possible codes
      const volumeDownCodes = [173, 174, 175, 176, 'VolumeDown', 'volumedown'];
      
      console.log('VolumeButtonCapture: Key event:', e.key, e.keyCode, e.code);
      
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
    };
    
    // This function initializes all the necessary hacks to capture volume buttons
    const initMobileCaptureSystem = () => {
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
    };
    
    // Initialize the system
    const system = initMobileCaptureSystem();
    
    // Clean up function
    return () => {
      // Remove event listeners
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyDown, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keyup', handleKeyDown, { capture: true });
      
      // Clean up overlay
      if (system.overlay) {
        system.overlay.removeEventListener('keydown', handleKeyDown, { capture: true });
        system.overlay.removeEventListener('keyup', handleKeyDown, { capture: true });
        
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
    };
  }, [isMobile, dispatch, vibrate]);
  
  // This component doesn't render anything visible
  return null;
};

export default VolumeButtonCapture; 