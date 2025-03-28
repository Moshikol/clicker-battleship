import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import gameReducer from './gameSlice';

// Configure persist options
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['resources', 'stats', 'counterColor'], // Only persist these parts of the state
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, gameReducer);

// Create the store with the persisted reducer
export const store = configureStore({
  reducer: {
    game: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 