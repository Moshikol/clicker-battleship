import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, shadows } from '../../styles/theme';

interface DigitalCounterProps {
  value: number;
  label?: string;
  digits?: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const DigitalCounter: React.FC<DigitalCounterProps> = ({
  value,
  label,
  digits = 5,
  size = 'large',
  color = colors.digitalRed,
}) => {
  // Format the number with leading zeros
  const formattedNumber = value.toString().padStart(digits, '0');
  
  // Different sizes for the counter
  const sizeStyles = {
    small: {
      container: { height: 40, minWidth: 40 },
      text: { fontSize: typography.fontSizes.medium },
      digit: { width: 24, height: 30 },
      label: { fontSize: typography.fontSizes.tiny },
    },
    medium: {
      container: { height: 60, minWidth: 60 },
      text: { fontSize: typography.fontSizes.xlarge },
      digit: { width: 36, height: 45 },
      label: { fontSize: typography.fontSizes.small },
    },
    large: {
      container: { height: 80, minWidth: 200 },
      text: { fontSize: typography.fontSizes.counter },
      digit: { width: 48, height: 60 },
      label: { fontSize: typography.fontSizes.medium },
    },
  };
  
  // Create individual digit elements for the stopwatch look
  const renderDigits = () => {
    return formattedNumber.split('').map((digit, index) => (
      <View 
        key={index} 
        style={[
          styles.digitContainer, 
          sizeStyles[size].digit
        ]}
      >
        <Text style={[styles.value, sizeStyles[size].text, { color }]}>
          {digit}
        </Text>
      </View>
    ));
  };
  
  return (
    <View style={[styles.container, sizeStyles[size].container]}>
      {label && <Text style={[styles.label, sizeStyles[size].label]}>{label}</Text>}
      <View style={styles.display}>
        {renderDigits()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#0A0A0A',
    ...shadows.medium,
  },
  display: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#555555',
  },
  digitContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 4,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#444444',
    justifyContent: 'center',
    alignItems: 'center',
    // LCD segment look
    shadowColor: 'rgba(255, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 5,
  },
  value: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    // Glow effect
    textShadowColor: 'rgba(255, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  label: {
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default DigitalCounter; 