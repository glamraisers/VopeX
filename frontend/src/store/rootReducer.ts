import { combineReducers } from '@reduxjs/toolkit';

// Import individual reducers
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import leadsReducer from './slices/leadsSlice';
import opportunitiesReducer from './slices/opportunitiesSlice';
import settingsReducer from './slices/settingsSlice';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  leads: leadsReducer,
  opportunities: opportunitiesReducer,
  settings: settingsReducer
});

export default rootReducer;