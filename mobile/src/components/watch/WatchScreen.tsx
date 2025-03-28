import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useMobile } from '../../context/MobileContext';
import { colors, spacing, typography } from '../../styles/theme';

interface WatchScreenProps {
  onNavigate: () => void;
}

const WatchScreen: React.FC<WatchScreenProps> = ({ onNavigate }) => {
  const { resources, stats } = useSelector((state: RootState) => state.game);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Watch Mode</Text>
        <TouchableOpacity onPress={onNavigate} style={styles.navButton}>
          <Text style={styles.navButtonText}>Game</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.watchFace}>
        <Text style={styles.timeText}>{formattedTime}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>Coins: {resources.coins}</Text>
          <Text style={styles.statText}>Clicks: {stats.totalClicks}</Text>
        </View>
      </View>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Tap the "Game" button to return to the clicker game.
          Your progress is automatically saved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.medium,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.large,
  },
  title: {
    fontSize: typography.fontSizes.xlarge,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.textPrimary,
  },
  navButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderRadius: 8,
  },
  navButtonText: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.medium as any,
  },
  watchFace: {
    width: '80%',
    aspectRatio: 1,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 8,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xxlarge,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  timeText: {
    fontSize: typography.fontSizes.xxlarge,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.large,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: spacing.medium,
  },
  statText: {
    fontSize: typography.fontSizes.medium,
    color: colors.textPrimary,
  },
  instructions: {
    marginTop: spacing.large,
    backgroundColor: colors.surface,
    padding: spacing.medium,
    borderRadius: 8,
  },
  instructionText: {
    fontSize: typography.fontSizes.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default WatchScreen; 