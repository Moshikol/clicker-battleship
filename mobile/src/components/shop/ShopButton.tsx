import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  Platform 
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { colors, shadows, spacing, typography } from '../../styles/theme';
import Shop from './Shop';

const ShopButton: React.FC = () => {
  const [showShop, setShowShop] = useState(false);
  const { resources } = useSelector((state: RootState) => state.game);
  
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setShowShop(true)}
          accessibilityLabel="Open Shop"
        >
          <View style={styles.iconContainer}>
            <View style={styles.cartIcon} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.tooltip}>
          <View style={styles.tooltipItem}>
            <View style={styles.bombIcon} />
            <Text style={styles.tooltipText}>{resources.bombs}</Text>
          </View>
          <View style={styles.tooltipItem}>
            <View style={styles.shieldIcon} />
            <Text style={styles.tooltipText}>{resources.shields}</Text>
          </View>
        </View>
      </View>
      
      <Shop 
        visible={showShop} 
        onClose={() => setShowShop(false)} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
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
  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    width: 24,
    height: 20,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    borderRadius: 4,
  },
  tooltip: {
    position: 'absolute',
    top: -30,
    right: 5,
    flexDirection: 'row',
    backgroundColor: colors.digitalBackground,
    borderRadius: 12,
    padding: spacing.small,
    ...shadows.medium,
  },
  tooltipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.small,
  },
  tooltipText: {
    color: colors.textPrimary,
    marginLeft: 4,
    fontFamily: typography.fontFamily.monospace,
  },
  bombIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: colors.hit,
  },
  shieldIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.shield,
    borderWidth: 0.5,
    borderColor: '#fff',
  },
});

export default ShopButton; 