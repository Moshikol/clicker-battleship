import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import { loadGameState, saveGameState } from '../utils/storage';

// Load saved state if available
const preloadedState = loadGameState();

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
  preloadedState: preloadedState ? { game: preloadedState } : undefined,
});

// Subscribe to store changes to save state
store.subscribe(() => {
  saveGameState(store.getState().game);
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>; 