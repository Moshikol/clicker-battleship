import { configureStore } from '@reduxjs/toolkit';
import gameReducer, {
  click,
  earnCoins,
  purchaseClickMultiplier,
  purchaseAutoClicker,
  autoClickTick,
  purchaseBomb,
  purchaseShield,
  upgradeBombEfficiency,
  upgradeShieldStrength
} from '../store/gameSlice';
import { GameState } from '../store/types';

describe('Game Slice - Clicker & Shop Tests', () => {
  let store: ReturnType<typeof configureStore>;
  
  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        game: gameReducer
      }
    });
  });

  describe('Clicker Mechanics', () => {
    test('should increment clicks when click action is dispatched', () => {
      // Act
      store.dispatch(click());
      
      // Assert
      const state = store.getState() as { game: GameState };
      expect(state.game.stats.totalClicks).toBe(1);
      expect(state.game.resources.clicks).toBe(1);
    });

    test('should earn coins based on click multiplier', () => {
      // Arrange - first add coins to buy a multiplier
      store.dispatch({
        type: 'game/addCoins',
        payload: 10
      });
      
      // Now purchase a click multiplier to get from 1x to 2x
      store.dispatch(purchaseClickMultiplier());
      
      // Act - earn coins with the new multiplier
      store.dispatch(earnCoins());
      
      // Assert
      const state = store.getState() as { game: GameState };
      expect(state.game.resources.coins).toBe(2); // 0 after purchase + 2 from earned coins
      expect(state.game.stats.totalCoinsEarned).toBe(2);
    });

    test('should handle multiple clicks correctly', () => {
      // Act
      for (let i = 0; i < 5; i++) {
        store.dispatch(click());
        store.dispatch(earnCoins());
      }
      
      // Assert
      const state = store.getState() as { game: GameState };
      expect(state.game.stats.totalClicks).toBe(5);
      expect(state.game.resources.clicks).toBe(5);
      expect(state.game.resources.coins).toBe(5); // Default multiplier is 1
      expect(state.game.stats.totalCoinsEarned).toBe(5);
    });
  });

  describe('Shop - Upgrades', () => {
    test('should purchase click multiplier when enough coins', () => {
      // Arrange - add coins
      store.dispatch({
        type: 'game/addCoins',
        payload: 20
      });
      
      // Initial multiplier cost should be 10 (1 * 10)
      
      // Act
      store.dispatch(purchaseClickMultiplier());
      
      // Assert
      const state = store.getState() as { game: GameState };
      expect(state.game.upgrades.clickMultiplier).toBe(2);
      expect(state.game.resources.coins).toBe(10); // 20 - 10
    });

    test('should not purchase click multiplier when not enough coins', () => {
      // Arrange - insufficient coins
      store.dispatch({
        type: 'game/addCoins',
        payload: 5
      });
      
      // Act
      store.dispatch(purchaseClickMultiplier());
      
      // Assert
      const state = store.getState() as { game: GameState };
      expect(state.game.upgrades.clickMultiplier).toBe(1); // Unchanged
      expect(state.game.resources.coins).toBe(5); // Unchanged
    });

    test('should purchase auto clicker when enough coins', () => {
      // Arrange - add coins
      store.dispatch({
        type: 'game/addCoins',
        payload: 60
      });
      
      // Initial auto-clicker cost is 50 ((0+1) * 50)
      
      // Act
      store.dispatch(purchaseAutoClicker());
      
      // Assert
      const state = store.getState() as { game: GameState };
      expect(state.game.upgrades.autoClickersCount).toBe(1);
      expect(state.game.resources.coins).toBe(10); // 60 - 50
    });

    test('auto clicker should generate coins on tick', () => {
      // Arrange - purchase an auto-clicker
      store.dispatch({
        type: 'game/addCoins',
        payload: 50
      });
      store.dispatch(purchaseAutoClicker());
      
      // Act - simulate auto click tick
      store.dispatch(autoClickTick());
      
      // Assert
      const state = store.getState() as { game: GameState };
      expect(state.game.resources.coins).toBe(1); // 0 + (1 auto-clicker * 1 multiplier)
      expect(state.game.stats.totalCoinsEarned).toBe(1);
    });
  });

  describe('Shop - Items', () => {
    test('should purchase bomb when enough coins', () => {
      // Arrange - add coins
      store.dispatch({
        type: 'game/addCoins',
        payload: 100
      });
      
      // Act
      store.dispatch(purchaseBomb());
      
      // Assert
      const state = store.getState() as { game: GameState };
      expect(state.game.resources.bombs).toBe(1);
      expect(state.game.resources.coins).toBe(0); // 100 - 100
    });

    test('should not purchase bomb when not enough coins', () => {
      // Arrange - insufficient coins
      store.dispatch({
        type: 'game/addCoins',
        payload: 90
      });
      
      // Act
      store.dispatch(purchaseBomb());
      
      // Assert
      const state = store.getState() as { game: GameState };
      expect(state.game.resources.bombs).toBe(0); // Unchanged
      expect(state.game.resources.coins).toBe(90); // Unchanged
    });

    test('should purchase shield when enough coins', () => {
      // Arrange - add coins
      store.dispatch({
        type: 'game/addCoins',
        payload: 50
      });
      
      // Get initial state
      const initialState = store.getState() as { game: GameState };
      const initialCoins = initialState.game.resources.coins;
      
      // Act
      store.dispatch(purchaseShield());
      
      // Assert - Check that the coins were spent and shields increased
      const state = store.getState() as { game: GameState };
      expect(state.game.resources.coins).toBe(0); // 50 - 50
      expect(state.game.resources.shields).toBe(11); // 10 (initial) + 1
    });

    test('should upgrade bomb efficiency when enough coins', () => {
      // Arrange - add coins
      store.dispatch({
        type: 'game/addCoins',
        payload: 200
      });
      
      // Act
      store.dispatch(upgradeBombEfficiency());
      
      // Assert
      const state = store.getState() as { game: GameState };
      expect(state.game.upgrades.bombEfficiency).toBe(2);
      expect(state.game.resources.coins).toBe(0); // 200 - 200
    });

    test('should upgrade shield strength when enough coins', () => {
      // Arrange - add coins
      store.dispatch({
        type: 'game/addCoins',
        payload: 150
      });
      
      // Act
      store.dispatch(upgradeShieldStrength());
      
      // Assert
      const state = store.getState() as { game: GameState };
      expect(state.game.upgrades.shieldStrength).toBe(2);
      expect(state.game.resources.coins).toBe(0); // 150 - 150
    });
  });

  describe('Happy Path - Full User Flow', () => {
    test('simulate full user interaction with clicker and shop', () => {
      // 1. User clicks multiple times to earn coins
      for (let i = 0; i < 10; i++) {
        store.dispatch(click());
        store.dispatch(earnCoins());
      }
      
      // Verify coins earned
      const stateAfterClicks = store.getState() as { game: GameState };
      expect(stateAfterClicks.game.resources.coins).toBe(10);
      expect(stateAfterClicks.game.stats.totalClicks).toBe(10);
      
      // 2. User purchases click multiplier
      store.dispatch(purchaseClickMultiplier());
      
      // Verify purchase
      const stateAfterMultiplierPurchase = store.getState() as { game: GameState };
      expect(stateAfterMultiplierPurchase.game.upgrades.clickMultiplier).toBe(2);
      expect(stateAfterMultiplierPurchase.game.resources.coins).toBe(0);
      
      // 3. User clicks more with the multiplier
      for (let i = 0; i < 5; i++) {
        store.dispatch(click());
        store.dispatch(earnCoins());
      }
      
      // Verify more coins earned with multiplier
      const stateAfterMoreClicks = store.getState() as { game: GameState };
      expect(stateAfterMoreClicks.game.resources.coins).toBe(10); // 5 clicks * 2 multiplier
      
      // 4. Add enough coins to purchase a shield (need 50, currently have 10)
      store.dispatch({
        type: 'game/addCoins',
        payload: 40
      });
      
      const initialShields = stateAfterMoreClicks.game.resources.shields;
      store.dispatch(purchaseShield());
      
      // Verify shield purchase (check shields increased and coins were spent)
      const stateAfterShieldPurchase = store.getState() as { game: GameState };
      expect(stateAfterShieldPurchase.game.resources.coins).toBe(0); // Spent all coins on shield
      expect(stateAfterShieldPurchase.game.resources.shields).toBe(initialShields + 1);
      
      // 5. User earns more coins and purchases an auto-clicker
      for (let i = 0; i < 25; i++) {
        store.dispatch(click());
        store.dispatch(earnCoins());
      }
      
      const stateBeforeAutoClickerPurchase = store.getState() as { game: GameState };
      expect(stateBeforeAutoClickerPurchase.game.resources.coins).toBe(50); // 25 clicks * 2 multiplier
      
      store.dispatch(purchaseAutoClicker());
      
      // Verify auto-clicker purchase
      const stateAfterAutoClickerPurchase = store.getState() as { game: GameState };
      expect(stateAfterAutoClickerPurchase.game.upgrades.autoClickersCount).toBe(1);
      expect(stateAfterAutoClickerPurchase.game.resources.coins).toBe(0);
      
      // 6. Auto-clicker generates coins
      store.dispatch(autoClickTick());
      
      // Verify auto-clicker effect
      const stateAfterFirstTick = store.getState() as { game: GameState };
      expect(stateAfterFirstTick.game.resources.coins).toBe(2); // 1 auto-clicker * 2 multiplier
      
      // 7. User continues clicking while auto-clicker runs
      for (let i = 0; i < 5; i++) {
        store.dispatch(click());
        store.dispatch(earnCoins());
        store.dispatch(autoClickTick());
      }
      
      // Manual clicks: 5 * 2 = 10
      // Auto-clicks: 5 * 2 = 10
      // Total: 2 (previous) + 10 + 10 = 22
      const finalState = store.getState() as { game: GameState };
      expect(finalState.game.resources.coins).toBe(22);
    });
  });
}); 