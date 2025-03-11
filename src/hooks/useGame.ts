import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/types';
import { click, purchaseClickMultiplier, purchaseAutoClicker, autoClickTick } from '../store/gameSlice';

export const useGame = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);

  useEffect(() => {
    const autoClickInterval = setInterval(() => {
      if (gameState.upgrades.autoClickersCount > 0) {
        dispatch(autoClickTick());
      }
    }, 1000);

    return () => clearInterval(autoClickInterval);
  }, [dispatch, gameState.upgrades.autoClickersCount]);

  const handleClick = () => {
    dispatch(click());
  };

  const handlePurchaseClickMultiplier = () => {
    dispatch(purchaseClickMultiplier());
  };

  const handlePurchaseAutoClicker = () => {
    dispatch(purchaseAutoClicker());
  };

  const getClickMultiplierCost = () => {
    return gameState.upgrades.clickMultiplier * 10;
  };

  const getAutoClickerCost = () => {
    return (gameState.upgrades.autoClickersCount + 1) * 50;
  };

  return {
    resources: gameState.resources,
    upgrades: gameState.upgrades,
    stats: gameState.stats,
    handleClick,
    handlePurchaseClickMultiplier,
    handlePurchaseAutoClicker,
    getClickMultiplierCost,
    getAutoClickerCost,
  };
}; 