import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { click, earnCoins } from '../../store/gameSlice';
import { colors, spacing, typography } from '../../styles/theme';
import CheckeredBackground from '../ui/CheckeredBackground';
import DigitalCounter from '../ui/DigitalCounter';
import ClickerButton from '../ui/ClickerButton';
import ResourceCounter from '../ui/ResourceCounter';
import ShopButton from '../shop/ShopButton';
import ColorPicker from '../ui/ColorPicker';
import * as Haptics from 'expo-haptics';

const { height } = Dimensions.get('window');

const GameScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { stats, resources, counterColor } = useSelector((state: RootState) => state.game);

  const vibrate = (duration: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const handlePress = () => {
    dispatch(click());
    dispatch(earnCoins());
    vibrate(50); // Provide haptic feedback
  };

  return (
    <View style={styles.container}>
      <CheckeredBackground>
        <View style={styles.contentWrapper}>
          <View style={styles.deviceFrame}>
            <View style={styles.titleBar}>
              <Text style={styles.title}>CLICKER BATTLESHIP</Text>
            </View>
            
            <View style={styles.stopwatchFace}>
              <View style={styles.counterContainer}>
                <DigitalCounter 
                  value={stats.totalClicks} 
                  digits={6} 
                  color="#FF00FF"
                />
              </View>
              
              <ClickerButton 
                label="CLICK ME" 
                onPress={handlePress} 
              />
            </View>
            
            <View style={styles.resourcesSection}>
              <View style={styles.resourcesHeader}>
                <Text style={styles.resourcesLabel}>COINS</Text>
                <Text style={styles.resourcesLabel}>BOMBS</Text>
                <Text style={styles.resourcesLabel}>SHIELDS</Text>
              </View>
              <View style={styles.resourcesContainer}>
                <ResourceCounter 
                  label="" 
                  value={resources.coins} 
                  digits={4}
                  color="#FF00FF"
                />
                <ResourceCounter 
                  label="" 
                  value={resources.bombs} 
                  digits={2}
                  color="#FF00FF"
                />
                <ResourceCounter 
                  label="" 
                  value={resources.shields} 
                  digits={2}
                  color="#FF00FF"
                />
              </View>
            </View>
          </View>
        </View>
      </CheckeredBackground>
      
      <ShopButton />
      <ColorPicker />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    minHeight: height,
  },
  deviceFrame: {
    backgroundColor: '#262626',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#444444',
    padding: spacing.medium,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  stopwatchFace: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#333333',
    padding: spacing.medium,
    alignItems: 'center',
    marginBottom: spacing.medium,
    // Stopwatch texture effect
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  titleBar: {
    width: '100%',
    backgroundColor: '#111111',
    paddingVertical: spacing.small,
    marginBottom: spacing.large,
    borderRadius: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333333',
  },
  title: {
    color: '#FFFFFF',
    fontSize: typography.fontSizes.medium,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  counterContainer: {
    marginBottom: spacing.medium,
    alignItems: 'center',
  },
  resourcesSection: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333333',
    padding: spacing.small,
    paddingVertical: spacing.medium,
    marginTop: spacing.small,
    overflow: 'hidden',
  },
  resourcesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingBottom: 6,
    marginBottom: 6,
  },
  resourcesLabel: {
    color: '#FFFFFF',
    fontSize: typography.fontSizes.small,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  resourcesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
});

export default GameScreen; 