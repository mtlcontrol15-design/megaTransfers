import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'reduxjs-toolkit-persist';
import EncryptedStorage from 'react-native-encrypted-storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';

import userSlice from './slices/userSlice';
import themeSlice from './slices/themeSlice';

const persistConfig = {
  key: 'root',
  version: 2,
  storage: EncryptedStorage,
  stateReconciler: autoMergeLevel1,
  migrate: async state => {
    if (
      state?.userReducer?.token &&
      !state?.userReducer?.refreshToken
    ) {
      return {
        ...state,
        userReducer: {
          ...state.userReducer,
          token: null,
          refreshToken: null,
          user: null,
          isSignedIn: false,
        },
      };
    }

    return state;
  },
};

const reducers = combineReducers({
  userReducer: userSlice,
  themeReducer: themeSlice,
});

const _persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: _persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistedStore = persistStore(store);