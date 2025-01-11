import { 
  createSlice, 
  PayloadAction, 
  createAsyncThunk 
} from '@reduxjs/toolkit';
import { apiService } from '../../services/api/baseApiService';

// Interface for application settings
export interface ApplicationSettings {
  theme: {
    mode: 'light' | 'dark' | 'system';
    primaryColor: string;
    secondaryColor: string;
  };
  notifications: {
    email: boolean;
    inApp: boolean;
    pushNotifications: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analyticsTracking: boolean;
  };
  performance: {
    dataCompressionEnabled: boolean;
    prefetchingEnabled: boolean;
  };
  accessibility: {
    highContrastMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
    screenReaderSupport: boolean;
  };
}

// Interface for system configuration
interface SystemConfig {
  version: string;
  maintenanceMode: boolean;
  featureFlags: {
    aiAssistant: boolean;
    quantumInsights: boolean;
    advancedAnalytics: boolean;
  };
}

// State interface
interface SettingsState {
  applicationSettings: ApplicationSettings;
  systemConfig: SystemConfig;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SettingsState = {
  applicationSettings: {
    theme: {
      mode: 'dark',
      primaryColor: '#3A66FF',
      secondaryColor: '#6A5ACD'
    },
    notifications: {
      email: true,
      inApp: true,
      pushNotifications: false
    },
    privacy: {
      dataSharing: false,
      analyticsTracking: true
    },
    performance: {
      dataCompressionEnabled: true,
      prefetchingEnabled: true
    },
    accessibility: {
      highContrastMode: false,
      fontSize: 'medium',
      screenReaderSupport: false
    }
  },
  systemConfig: {
    version: '1.0.0',
    maintenanceMode: false,
    featureFlags: {
      aiAssistant: true,
      quantumInsights: true,
      advancedAnalytics: false
    }
  },
  loading: false,
  error: null
};

// Async Thunks
export const fetchApplicationSettings = createAsyncThunk(
  'settings/fetchApplicationSettings',
  async (_, { rejectWithValue }) => {
    try {
      const settings = await apiService.get<ApplicationSettings>('/settings/application');
      return settings;
    } catch (error) {
      return rejectWithValue('Failed to fetch application settings');
    }
  }
);

export const updateApplicationSettings = createAsyncThunk(
  'settings/updateApplicationSettings',
  async (
    settings: Partial<ApplicationSettings>, 
    { rejectWithValue }
  ) => {
    try {
      const updatedSettings = await apiService.patch<
        Partial<ApplicationSettings>, 
        ApplicationSettings
      >('/settings/application', settings);
      return updatedSettings;
    } catch (error) {
      return rejectWithValue('Failed to update application settings');
    }
  }
);

export const fetchSystemConfig = createAsyncThunk(
  'settings/fetchSystemConfig',
  async (_, { rejectWithValue }) => {
    try {
      const config = await apiService.get<SystemConfig>('/settings/system');
      return config;
    } catch (error) {
      return rejectWithValue('Failed to fetch system configuration');
    }
  }
);

// Settings Slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Synchronous reducers for immediate state updates
    setThemeMode: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.applicationSettings.theme.mode = action.payload;
    },
    toggleNotification: (
      state, 
      action: PayloadAction<keyof ApplicationSettings['notifications']>
    ) => {
      const key = action.payload;
      state.applicationSettings.notifications[key] = 
        !state.applicationSettings.notifications[key];
    },
    setAccessibilityOption: (
      state, 
      action: PayloadAction<{
        option: keyof ApplicationSettings['accessibility'];
        value: any;
      }>
    ) => {
      const { option, value } = action.payload;
      state.applicationSettings.accessibility[option] = value;
    }
  },
  extraReducers: (builder) => {
    // Fetch Application Settings
    builder.addCase(fetchApplicationSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchApplicationSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.applicationSettings = action.payload;
    });
    builder.addCase(fetchApplicationSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Application Settings
    builder.addCase(updateApplicationSettings.fulfilled, (state, action) => {
      state.applicationSettings = {
        ...state.applicationSettings,
        ...action.payload
      };
    });

    // Fetch System Config
    builder.addCase(fetchSystemConfig.fulfilled, (state, action) => {
      state.systemConfig = action.payload;
    });
  }
});

// Selectors
export const selectThemeMode = (state: { settings: SettingsState }) => 
  state.settings.applicationSettings.theme.mode;

export const selectIsAiAssistantEnabled = (state: { settings: SettingsState }) => 
  state.settings.systemConfig.featureFlags.aiAssistant;

export const selectIsMaintenanceMode = (state: { settings: SettingsState }) => 
  state.settings.systemConfig.maintenanceMode;

// Export Actions and Reducer
export const { 
  setThemeMode, 
  toggleNotification,
  setAccessibilityOption
} = settingsSlice.actions;

export default settingsSlice.reducer;