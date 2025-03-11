import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { 
  click, 
  purchaseClickMultiplier, 
  purchaseAutoClicker, 
  purchaseBomb,
  purchaseShield,
  upgradeBombEfficiency,
  upgradeShieldStrength
} from '../../store/gameSlice';
import styles from './Clicker.module.css';

export const Clicker: React.FC = () => {
  const dispatch = useDispatch();
  const { resources, upgrades, stats } = useSelector((state: RootState) => state.game);
  
  const handleClick = () => {
    dispatch(click());
  };
  
  const handlePurchaseClickMultiplier = () => {
    dispatch(purchaseClickMultiplier());
  };
  
  const handlePurchaseAutoClicker = () => {
    dispatch(purchaseAutoClicker());
  };
  
  const handlePurchaseBomb = () => {
    dispatch(purchaseBomb());
  };
  
  const handlePurchaseShield = () => {
    dispatch(purchaseShield());
  };
  
  const handleUpgradeBombEfficiency = () => {
    dispatch(upgradeBombEfficiency());
  };
  
  const handleUpgradeShieldStrength = () => {
    dispatch(upgradeShieldStrength());
  };
  
  const getClickMultiplierCost = () => {
    return upgrades.clickMultiplier * 10;
  };
  
  const getAutoClickerCost = () => {
    return (upgrades.autoClickersCount + 1) * 50;
  };
  
  const getBombEfficiencyCost = () => {
    return upgrades.bombEfficiency * 200;
  };
  
  const getShieldStrengthCost = () => {
    return upgrades.shieldStrength * 150;
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.resourcesSection}>
        <h2>Resources</h2>
        <div className={styles.resourceGrid}>
          <div className={styles.resourceItem}>
            <span className={styles.resourceLabel}>Coins:</span>
            <span className={styles.resourceValue}>{resources.coins}</span>
          </div>
          <div className={styles.resourceItem}>
            <span className={styles.resourceLabel}>Bombs:</span>
            <span className={styles.resourceValue}>{resources.bombs}</span>
          </div>
          <div className={styles.resourceItem}>
            <span className={styles.resourceLabel}>Shields:</span>
            <span className={styles.resourceValue}>{resources.shields}</span>
          </div>
          <div className={styles.resourceItem}>
            <span className={styles.resourceLabel}>Click Multiplier:</span>
            <span className={styles.resourceValue}>{upgrades.clickMultiplier}x</span>
          </div>
          <div className={styles.resourceItem}>
            <span className={styles.resourceLabel}>Auto-Clickers:</span>
            <span className={styles.resourceValue}>{upgrades.autoClickersCount}</span>
          </div>
          <div className={styles.resourceItem}>
            <span className={styles.resourceLabel}>Bomb Efficiency:</span>
            <span className={styles.resourceValue}>{upgrades.bombEfficiency}</span>
          </div>
          <div className={styles.resourceItem}>
            <span className={styles.resourceLabel}>Shield Strength:</span>
            <span className={styles.resourceValue}>{upgrades.shieldStrength}</span>
          </div>
        </div>
      </div>

      <div className={styles.clickerSection}>
        <button className={styles.clickButton} onClick={handleClick}>
          Click Me!
        </button>
        <div className={styles.clickStats}>
          <p>Total Clicks: {stats.totalClicks}</p>
          <p>Total Coins Earned: {stats.totalCoinsEarned}</p>
        </div>
      </div>

      <div className={styles.upgradesSection}>
        <h2>Upgrades</h2>
        <div className={styles.upgradeGrid}>
          <div className={styles.upgradeCard}>
            <h3>Click Multiplier</h3>
            <p>Increase coins per click</p>
            <p>Current: {upgrades.clickMultiplier}x</p>
            <button
              className={styles.upgradeButton}
              onClick={handlePurchaseClickMultiplier}
              disabled={resources.coins < getClickMultiplierCost()}
            >
              Upgrade ({getClickMultiplierCost()} coins)
            </button>
          </div>
          
          <div className={styles.upgradeCard}>
            <h3>Auto-Clicker</h3>
            <p>Automatically click every second</p>
            <p>Current: {upgrades.autoClickersCount}</p>
            <button
              className={styles.upgradeButton}
              onClick={handlePurchaseAutoClicker}
              disabled={resources.coins < getAutoClickerCost()}
            >
              Buy ({getAutoClickerCost()} coins)
            </button>
          </div>
          
          <div className={styles.upgradeCard}>
            <h3>Bomb Efficiency</h3>
            <p>Increase bomb blast radius</p>
            <p>Current: {upgrades.bombEfficiency}</p>
            <button
              className={styles.upgradeButton}
              onClick={handleUpgradeBombEfficiency}
              disabled={resources.coins < getBombEfficiencyCost()}
            >
              Upgrade ({getBombEfficiencyCost()} coins)
            </button>
          </div>
          
          <div className={styles.upgradeCard}>
            <h3>Shield Strength</h3>
            <p>Improve shield durability</p>
            <p>Current: {upgrades.shieldStrength}</p>
            <button
              className={styles.upgradeButton}
              onClick={handleUpgradeShieldStrength}
              disabled={resources.coins < getShieldStrengthCost()}
            >
              Upgrade ({getShieldStrengthCost()} coins)
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.purchaseSection}>
        <h2>Purchase Items</h2>
        <div className={styles.purchaseGrid}>
          <div className={styles.purchaseCard}>
            <h3>Reset Bomb</h3>
            <p>Powerful weapon that hits multiple cells</p>
            <p>Current: {resources.bombs}</p>
            <button
              className={styles.purchaseButton}
              onClick={handlePurchaseBomb}
              disabled={resources.coins < 100}
            >
              Buy (100 coins)
            </button>
          </div>
          
          <div className={styles.purchaseCard}>
            <h3>Shield</h3>
            <p>Protects your ships from one hit</p>
            <p>Current: {resources.shields}</p>
            <button
              className={styles.purchaseButton}
              onClick={handlePurchaseShield}
              disabled={resources.coins < 50}
            >
              Buy (50 coins)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 