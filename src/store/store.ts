import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import { loadGameState, saveGameState } from '../utils/storage';

// Create a function to initialize the store with user-specific data
export const initializeStore = (userId?: string) => {
  // Load saved state for the given user if available
  const preloadedState = loadGameState(userId);

  const store = configureStore({
    reducer: {
      game: gameReducer,
    },
    preloadedState: preloadedState ? { game: preloadedState } : undefined,
  });

  // Subscribe to store changes to save state for the specific user
  store.subscribe(() => {
    saveGameState(store.getState().game, userId);
  });

  return store;
};

// Create initial anonymous store
export const store = initializeStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>; 