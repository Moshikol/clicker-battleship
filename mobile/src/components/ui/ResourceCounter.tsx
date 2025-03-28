import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, shadows } from '../../styles/theme';

interface ResourceCounterProps {
  label: string;
  value: number;
  digits?: number;
  color?: string;
}

const ResourceCounter: React.FC<ResourceCounterProps> = ({
  label,
  value,
  digits = 2,
  color = colors.digitalRed,
}) => {
  // Format the number with leading zeros for display
  const formattedValue = value.toString().padStart(digits, '0');

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.displayContainer}>
        {Array.from(formattedValue).map((digit, index) => (
          <View key={index} style={styles.digitBox}>
            <Text style={[styles.digitText, { color }]}>{digit}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.small,
    marginBottom: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  displayContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#444444',
    padding: 3,
    width: '100%',
    minHeight: 26,
  },
  digitBox: {
    width: 18,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    marginHorizontal: 1,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#555555',
    shadowColor: 'rgba(255, 0, 255, 0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 3,
  },
  digitText: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 0, 255, 0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});

export default ResourceCounter; 