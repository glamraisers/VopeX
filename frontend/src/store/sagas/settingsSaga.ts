import { 
  call, 
  put, 
  takeLatest, 
  all, 
  fork,
  delay,
  select
} from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/api/baseApiService';
import { 
  fetchApplicationSettings,
  updateApplicationSettings,
  fetchSystemConfig,
  setThemeMode
} from '../slices/settingsSlice';

// Interface for system configuration sync
interface SystemConfigSync {
  version: string;
  featureFlags: Record<string, boolean>;
  maintenanceMode: boolean;
}

// Settings Synchronization Saga
function* fetchApplicationSettingsSaga() {
  try {
    // Fetch application settings from API
    const settings = yield call(
      apiService.get, 
      '/settings/application'
    );

    yield put(fetchApplicationSettings.fulfilled(settings));

    // Automatically apply certain settings
    if (settings.theme) {
      yield put(setThemeMode(settings.theme.mode));
    }
  } catch (error: any) {
    yield put(fetchApplicationSettings.rejected(error.message));
  }
}

// Update Application Settings Saga
function* updateApplicationSettingsSaga(
  action: PayloadAction<Partial<any>>
) {
  try {
    const currentUser = yield select(state => state.user.profile);
    
    // Validate settings update
    const validatedSettings = yield call(
      validateSettingsUpdate, 
      action.payload
    );

    // Send update to API
    const updatedSettings = yield call(
      apiService.patch,
      `/settings/application/${currentUser.id}`,
      validatedSettings
    );

    yield put(updateApplicationSettings.fulfilled(updatedSettings));

    // Perform side effects based on settings
    yield call(handleSettingsUpdateSideEffects, updatedSettings);
  } catch (error: any) {
    yield put(updateApplicationSettings.rejected(error.message));
  }
}

// Validate settings update
function* validateSettingsUpdate(settings: any) {
  // Implement custom validation logic
  const validationRules = {
    theme: (value: any) => {
      const validModes = ['light', 'dark', 'system'];
      return validModes.includes(value.mode);
    },
    notifications: (value: any) => {
      return typeof value.email === 'boolean' &&
             typeof value.inApp === 'boolean';
    }
  };

  // Validate each setting
  for (const [key, validator] of Object.entries(validationRules)) {
    if (settings[key] && !validator(settings[key])) {
      throw new Error(`Invalid ${key} settings`);
    }
  }

  return settings;
}

// Handle settings update side effects
function* handleSettingsUpdateSideEffects(settings: any) {
  // Theme change
  if (settings.theme) {
    yield call(applyTheme, settings.theme.mode);
  }

  // Notification settings
  if (settings.notifications) {
    yield call(updateNotificationPreferences, settings.notifications);
  }
}

// Apply theme
function* applyTheme(mode: string) {
  // Implement theme application logic
  document.documentElement.setAttribute('data-theme', mode);
}

// Update notification preferences
function* updateNotificationPreferences(preferences: any) {
  // Send notification preference update to backend
  yield call(
    apiService.post, 
    '/user/notification-preferences', 
    preferences
  );
}

// System Configuration Sync Saga
function* systemConfigSyncSaga() {
  while (true) {
    try {
      // Fetch latest system configuration
      const systemConfig: SystemConfigSync = yield call(
        apiService.get, 
        '/settings/system-config'
      );

      // Update local store with system config
      yield put(fetchSystemConfig.fulfilled(systemConfig));

      // Handle feature flags
      yield call(processFeatureFlags, systemConfig.featureFlags);

      // Check maintenance mode
      if (systemConfig.maintenanceMode) {
        yield put({ type: 'app/enterMaintenanceMode' });
      }

      // Sync every hour
      yield delay(60 * 60 * 1000);
    } catch (error) {
      console.error('System config sync failed', error);
      // Retry with exponential backoff
      yield delay(5 * 60 * 1000);
    }
  }
}

// Process feature flags
function* processFeatureFlags(flags: Record<string, boolean>) {
  for (const [flagName, enabled] of Object.entries(flags)) {
    if (enabled) {
      yield put({ 
        type: `features/${flagName}/enable` 
      });
    } else {
      yield put({ 
        type: `features/${flagName}/disable` 
      });
    }
  }
}

// Watcher Saga
function* watchSettingsActions() {
  yield all([
    takeLatest(fetchApplicationSettings.pending.type, fetchApplicationSettingsSaga),
    takeLatest(updateApplicationSettings.pending.type, updateApplicationSettingsSaga)
  ]);
}

// Root Settings Saga
export default function* settingsSaga() {
  yield all([
    fork(watchSettingsActions),
    fork(systemConfigSyncSaga)
  ]);
}