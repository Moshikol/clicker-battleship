import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { click, earnCoins } from '../../store/gameSlice';
import { useMobile } from '../../context/MobileContext';

// This component captures volume button events on mobile devices
const VolumeButtonCapture: React.FC = () => {
  const dispatch = useDispatch();
  const { isMobile, vibrate } = useMobile();
  
  useEffect(() => {
    if (!isMobile) return;
    
    // Create a fullscreen overlay element to capture volume button events
    const createOverlay = () => {
      const overlay = document.createElement('div');
      overlay.id = 'volume-button-capture';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: transparent;
        z-index: -1;
        pointer-events: none;
      `;
      
      document.body.appendChild(overlay);
      return overlay;
    };
    
    // Add event listener for volume button press (Android)
    const handleKeyDown = (e: KeyboardEvent) => {
      const volumeDownCodes = [173, 174, 175, 176, 'VolumeDown'];
      
      console.log('VolumeButtonCapture: Key event:', e.key, e.keyCode, e.code);
      
      if (volumeDownCodes.includes(e.keyCode as any) || volumeDownCodes.includes(e.key)) {
        console.log('VolumeButtonCapture: Volume Down detected!');
        e.preventDefault();
        e.stopPropagation();
        
        // Trigger click and earn coins
        dispatch(click());
        dispatch(earnCoins());
        
        // Vibrate for feedback
        vibrate(50);
        
        return false;
      }
      
      return true;
    };
    
    // Setup for capturing volume button events
    const setup = () => {
      const overlay = createOverlay();
      
      // Register various event listeners for maximum compatibility
      window.addEventListener('keydown', handleKeyDown, { capture: true });
      document.addEventListener('keydown', handleKeyDown, { capture: true });
      overlay.addEventListener('keydown', handleKeyDown, { capture: true });
      
      // For devices that use MediaSession (some Android devices)
      if ('mediaSession' in navigator) {
        try {
          // @ts-ignore - TypeScript might not recognize MediaSession API
          navigator.mediaSession.setActionHandler('previoustrack', () => {
            console.log('VolumeButtonCapture: Media session event detected');
            dispatch(click());
            dispatch(earnCoins());
            vibrate(50);
          });
        } catch (error) {
          console.error('MediaSession error:', error);
        }
      }
    };
    
    setup();
    
    // Cleanup function
    return () => {
      const overlay = document.getElementById('volume-button-capture');
      if (overlay) {
        overlay.remove();
      }
      
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      
      if ('mediaSession' in navigator) {
        try {
          // @ts-ignore
          navigator.mediaSession.setActionHandler('previoustrack', null);
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