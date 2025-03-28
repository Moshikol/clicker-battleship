import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { DeviceMotion } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import { click, earnCoins } from '../../store/gameSlice';

interface DeviceMotionHandlerProps {
  enabled?: boolean;
  sensitivity?: number; // Higher = more sensitive
}

const DeviceMotionHandler: React.FC<DeviceMotionHandlerProps> = ({
  enabled = true,
  sensitivity = 1.2
}) => {
  const dispatch = useDispatch();
  const [subscription, setSubscription] = useState<ReturnType<typeof DeviceMotion.addListener> | null>(null);
  const [lastMotion, setLastMotion] = useState<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 });
  const [lastTriggerTime, setLastTriggerTime] = useState(0);

  const handleMotionChange = (motionData: any) => {
    const { acceleration } = motionData;
    if (!acceleration) return;

    const now = Date.now();
    // Debounce to not trigger too many times
    if (now - lastTriggerTime < 500) return;

    // Calculate the difference in acceleration
    const deltaX = Math.abs(acceleration.x - lastMotion.x);
    const deltaY = Math.abs(acceleration.y - lastMotion.y);
    const deltaZ = Math.abs(acceleration.z - lastMotion.z);

    // Total movement magnitude
    const totalDelta = deltaX + deltaY + deltaZ;

    // If movement is significant enough, trigger the click
    if (totalDelta > sensitivity) {
      handleDeviceMotion();
      setLastTriggerTime(now);
    }

    // Update last motion values
    setLastMotion({
      x: acceleration.x,
      y: acceleration.y,
      z: acceleration.z
    });
  };

  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return;

    // Set up device motion listener
    DeviceMotion.setUpdateInterval(100); // Update every 100ms
    const motionSubscription = DeviceMotion.addListener(handleMotionChange);
    setSubscription(motionSubscription);

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [enabled, lastMotion, lastTriggerTime]);

  const handleDeviceMotion = () => {
    // Increment the counter when the device is moved
    dispatch(click());
    dispatch(earnCoins());
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  // This component doesn't render anything visible
  return null;
};

export default DeviceMotionHandler; 