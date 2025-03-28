import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Easing,
  TouchableOpacityProps
} from 'react-native';
import { colors, typography, shadows } from '../../styles/theme';

interface ClickerButtonProps extends TouchableOpacityProps {
  label?: string;
  onPress: () => void;
}

const ClickerButton: React.FC<ClickerButtonProps> = ({ 
  label = 'CLICK ME', 
  onPress,
  ...props
}) => {
  // Animation value for the button press effect
  const [scaleAnim] = useState(new Animated.Value(1));
  
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    }).start();
  };
  
  const handlePress = () => {
    onPress();
  };
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={styles.buttonContainer}
      {...props}
    >
      <Animated.View 
        style={[
          styles.button,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#0D0D0D',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#333333',
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // Gradient-like background effect
    shadowColor: 'rgba(0, 255, 0, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSizes.large,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: 'monospace',
    textShadowColor: 'rgba(0, 255, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default ClickerButton; 