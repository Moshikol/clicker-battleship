import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { purchaseBomb, purchaseShield } from '../../store/gameSlice';
import { colors, spacing, typography, shadows } from '../../styles/theme';
import * as Haptics from 'expo-haptics';

interface ShopProps {
  visible: boolean;
  onClose: () => void;
}

const Shop: React.FC<ShopProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { resources } = useSelector((state: RootState) => state.game);

  const handlePurchaseBomb = () => {
    if (resources.coins >= 50) {
      dispatch(purchaseBomb());
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  const handlePurchaseShield = () => {
    if (resources.coins >= 200) {
      dispatch(purchaseShield());
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  const canBuyBomb = resources.coins >= 50;
  const canBuyShield = resources.coins >= 200;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.shopContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>SHOP</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeButton}>X</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.resourcesContainer}>
                <View style={styles.resource}>
                  <Text style={styles.resourceLabel}>COINS:</Text>
                  <Text style={styles.resourceValue}>{resources.coins}</Text>
                </View>
                <View style={styles.resource}>
                  <Text style={styles.resourceLabel}>BOMBS:</Text>
                  <Text style={styles.resourceValue}>{resources.bombs}</Text>
                </View>
                <View style={styles.resource}>
                  <Text style={styles.resourceLabel}>SHIELDS:</Text>
                  <Text style={styles.resourceValue}>{resources.shields}</Text>
                </View>
              </View>

              <View style={styles.shopItems}>
                <View style={styles.shopItem}>
                  <View style={styles.itemInfo}>
                    <View style={styles.bombIcon} />
                    <Text style={styles.itemName}>BOMB</Text>
                    <Text style={styles.itemDescription}>
                      Deploy to clear part of the board
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.buyButton, 
                      !canBuyBomb && styles.buyButtonDisabled
                    ]}
                    onPress={handlePurchaseBomb}
                    disabled={!canBuyBomb}
                  >
                    <Text style={styles.buyButtonText}>BUY - 50 COINS</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.shopItem}>
                  <View style={styles.itemInfo}>
                    <View style={styles.shieldIcon} />
                    <Text style={styles.itemName}>SHIELD</Text>
                    <Text style={styles.itemDescription}>
                      Protects you from losing bombs
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.buyButton, 
                      !canBuyShield && styles.buyButtonDisabled
                    ]}
                    onPress={handlePurchaseShield}
                    disabled={!canBuyShield}
                  >
                    <Text style={styles.buyButtonText}>BUY - 200 COINS</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.digitalBackground,
    ...shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.digitalBackground,
  },
  title: {
    fontFamily: typography.fontFamily.monospace,
    fontSize: typography.fontSizes.large,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: typography.fontSizes.large,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  resourcesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.medium,
    backgroundColor: colors.digitalBackground,
  },
  resource: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceLabel: {
    fontFamily: typography.fontFamily.monospace,
    fontSize: typography.fontSizes.small,
    color: colors.textPrimary,
    marginRight: spacing.small,
  },
  resourceValue: {
    fontFamily: typography.fontFamily.monospace,
    fontSize: typography.fontSizes.small,
    color: colors.hit,
  },
  shopItems: {
    padding: spacing.medium,
  },
  shopItem: {
    marginBottom: spacing.large,
    padding: spacing.medium,
    borderRadius: 5,
    backgroundColor: colors.digitalBackground,
  },
  itemInfo: {
    marginBottom: spacing.medium,
  },
  bombIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: colors.hit,
    marginBottom: spacing.small,
  },
  shieldIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.shield,
    borderWidth: 0.5,
    borderColor: '#fff',
    marginBottom: spacing.small,
  },
  itemName: {
    fontFamily: typography.fontFamily.monospace,
    fontSize: typography.fontSizes.medium,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: spacing.small,
  },
  itemDescription: {
    fontFamily: typography.fontFamily.monospace,
    fontSize: typography.fontSizes.small,
    color: colors.textSecondary,
  },
  buyButton: {
    backgroundColor: colors.accent,
    padding: spacing.medium,
    borderRadius: 5,
    alignItems: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.7,
  },
  buyButtonText: {
    fontFamily: typography.fontFamily.monospace,
    fontSize: typography.fontSizes.small,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Shop; 