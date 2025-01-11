import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import root reducer and root saga
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

// Create Saga middleware
const sagaMiddleware = createSagaMiddleware();

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: [
    'auth', 
    'user', 
    'settings'
  ]
};

// Create persistant reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with enhanced options
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ]
      }
    }).concat(sagaMiddleware),
  
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
  
  // Optional: Add additional store enhancers
  enhancers: (defaultEnhancers) => [
    ...defaultEnhancers
  ]
});

// Create persistor
const persistor = persistStore(store);

// Run root saga
sagaMiddleware.run(rootSaga);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store and persistor
export { store, persistor };