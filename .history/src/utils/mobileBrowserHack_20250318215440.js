/**
 * Mobile Browser Hacks - Utility functions to help capture volume button events
 * on mobile browsers, which typically restrict access to hardware buttons.
 */

// Attempts to initialize a dummy audio context to help capture media events
export const initAudioContext = () => {
  try {
    // Create a dummy AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    
    const audioContext = new AudioContext();
    
    // Create a gain node (volume control)
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.001; // Almost silent
    
    // Create an oscillator (sound generator)
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // 440 Hz - A4 note
    
    // Connect the oscillator to the gain node, and the gain node to the output
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Start the oscillator
    oscillator.start();
    
    // Resume the audio context (important for iOS)
    if (audioContext.state === 'suspended') {
      document.addEventListener('click', () => {
        audioContext.resume().then(() => {
          console.log('AudioContext resumed by user gesture');
        }).catch(error => {
          console.error('Failed to resume audio context:', error);
        });
      }, { once: true });
    }
    
    return {
      audioContext,
      oscillator,
      gainNode,
      
      // Clean up function
      cleanup: () => {
        try {
          oscillator.stop();
          oscillator.disconnect();
          gainNode.disconnect();
          if (audioContext.close) {
            audioContext.close();
          }
        } catch (error) {
          console.error('Error cleaning up audio context:', error);
        }
      }
    };
  } catch (error) {
    console.error('Error initializing audio context:', error);
    return null;
  }
};

// Initializes a media element to help capture media events
export const initMediaElement = () => {
  try {
    // Create a hidden audio element
    const audio = document.createElement('audio');
    
    // Use a minimal silent audio file
    audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    audio.loop = true;
    audio.muted = true;
    audio.volume = 0.001;
    audio.setAttribute('playsinline', '');
    audio.setAttribute('webkit-playsinline', '');
    
    // Hide the element but keep it in the DOM
    audio.style.display = 'none';
    audio.style.position = 'absolute';
    audio.style.left = '-9999px';
    audio.style.top = '-9999px';
    
    document.body.appendChild(audio);
    
    // Try to play the audio (needed for iOS)
    const playAudio = () => {
      audio.play().catch(error => {
        console.warn('Media element could not play:', error);
      });
    };
    
    // Play on user interaction
    document.addEventListener('click', playAudio, { once: true });
    document.addEventListener('touchstart', playAudio, { once: true });
    
    return {
      element: audio,
      play: playAudio,
      
      // Clean up function
      cleanup: () => {
        try {
          audio.pause();
          if (document.body.contains(audio)) {
            document.body.removeChild(audio);
          }
          document.removeEventListener('click', playAudio);
          document.removeEventListener('touchstart', playAudio);
        } catch (error) {
          console.error('Error cleaning up media element:', error);
        }
      }
    };
  } catch (error) {
    console.error('Error initializing media element:', error);
    return null;
  }
};

// Attempt to enable the device's vibration motor
export const enableVibration = () => {
  if ('vibrate' in navigator) {
    try {
      // Test the vibration API with a very short vibration
      navigator.vibrate(1);
      return true;
    } catch (e) {
      console.error('Vibration failed:', e);
      return false;
    }
  }
  return false;
};

// Determine if running on iOS
export const isIOS = () => {
  try {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  } catch (e) {
    console.error('Error checking for iOS:', e);
    return false;
  }
};

// Determine if running on Android
export const isAndroid = () => {
  try {
    return /Android/.test(navigator.userAgent);
  } catch (e) {
    console.error('Error checking for Android:', e);
    return false;
  }
};

// Creates a fullscreen transparent overlay to help capture events
export const createCaptureOverlay = (id = 'volume-button-capture') => {
  try {
    const existingOverlay = document.getElementById(id);
    if (existingOverlay) return existingOverlay;
    
    const overlay = document.createElement('div');
    overlay.id = id;
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
  } catch (error) {
    console.error('Error creating capture overlay:', error);
    return null;
  }
}; 