import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { click } from '../store/gameSlice';

export const useMobileControls = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Function to handle volume button presses
    const handleVolumeButtonPress = (e: KeyboardEvent) => {
      // Check for volume down key (code 175 is for volume down)
      if (e.keyCode === 175 || e.key === 'VolumeDown') {
        e.preventDefault(); // Prevent default browser action
        
        // Trigger click action
        dispatch(click());
        
        // Vibrate if supported (100ms vibration)
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
      }
    };

    // Add event listener for keydown events
    window.addEventListener('keydown', handleVolumeButtonPress);

    // Clean up on unmount
    return () => {
      window.removeEventListener('keydown', handleVolumeButtonPress);
    };
  }, [dispatch]);

  // Method to trigger vibration
  const vibrate = (duration: number = 100) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  };

  // Check if device has vibration support
  const hasVibrationSupport = () => {
    return 'vibrate' in navigator;
  };

  // Method to check if the app is running on a mobile device
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  return {
    vibrate,
    hasVibrationSupport,
    isMobileDevice,
  };
}; 