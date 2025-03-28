import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../styles/theme';

const { width, height } = Dimensions.get('window');

interface CheckeredBackgroundProps {
  children: React.ReactNode;
  checkerSize?: number;
}

const CheckeredBackground: React.FC<CheckeredBackgroundProps> = ({ 
  children, 
  checkerSize = 20 
}) => {
  // Calculate how many checkers we need based on screen size
  const horizontalCheckers = Math.ceil(width / checkerSize) + 1;
  const verticalCheckers = Math.ceil(height / checkerSize) + 1;
  
  // Create the checker pattern
  const renderCheckers = () => {
    const checkers = [];
    for (let y = 0; y < verticalCheckers; y++) {
      for (let x = 0; x < horizontalCheckers; x++) {
        const isEven = (x + y) % 2 === 0;
        checkers.push(
          <View
            key={`${x}-${y}`}
            style={[
              styles.checker,
              {
                width: checkerSize,
                height: checkerSize,
                top: y * checkerSize,
                left: x * checkerSize,
                backgroundColor: isEven ? colors.background : colors.backgroundSecondary,
              },
            ]}
          />
        );
      }
    }
    return checkers;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.checkeredPattern}>{renderCheckers()}</View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  checkeredPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  checker: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default CheckeredBackground; 