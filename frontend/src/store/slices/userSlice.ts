import { 
  createSlice, 
  PayloadAction, 
  createAsyncThunk 
} from '@reduxjs/toolkit';
import { apiService } from '../../services/api/baseApiService';
import { authService } from '../../services/auth/authService';

// User Role Enum
export enum UserRole {
  ADMIN = 'admin',
  SALES_MANAGER = 'sales_manager',
  SALES_REP = 'sales_rep',
  ANALYST = 'analyst',
  VIEWER = 'viewer'
}

// User Permissions Interface
interface UserPermissions {
  leads: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  opportunities: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  analytics: {
    view: boolean;
    export: boolean;
  };
}

// User Interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  phone?: string;
  department?: string;
  permissions: UserPermissions;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User Profile Update Interface
interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
}

// State Interface
interface UserState {
  profile: User | null;
  loading: boolean;
  error: string | null;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
}

// Initial State
const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
  preferences: {
    theme: 'dark',
    language: 'en',
    notifications: true
  }
};

// Async Thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No user found');

      const profile = await apiService.get<User>(`/users/${user.id}`);
      return profile;
    } catch (error) {
      return rejectWithValue('Failed to fetch user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: UserProfileUpdate, { rejectWithValue }) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No user found');

      const updatedProfile = await apiService.put<UserProfileUpdate, User>(
        `/users/${user.id}`, 
        profileData
      );
      return updatedProfile;
    } catch (error) {
      return rejectWithValue('Failed to update user profile');
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences: Partial<UserState['preferences']>, { rejectWithValue }) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No user found');

      await apiService.patch(`/users/${user.id}/preferences`, preferences);
      return preferences;
    } catch (error) {
      return rejectWithValue('Failed to update user preferences');
    }
  }
);

// User Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfilePicture: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.profilePicture = action.payload;
      }
    },
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.profile = null;
    });

    // Update Profile
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });

    // Update Preferences
    builder.addCase(updateUserPreferences.fulfilled, (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload
      };
    });
  }
});

// Selectors
export const selectUserPermissions = (state: { user: UserState }) => 
  state.user.profile?.permissions;

export const selectCanViewLeads = (state: { user: UserState }) => 
  state.user.profile?.permissions.leads.view || false;

export const selectCanEditOpportunities = (state: { user: UserState }) => 
  state.user.profile?.permissions.opportunities.edit || false;

// Export Actions and Reducer
export const { 
  setProfilePicture, 
  clearUserError 
} = userSlice.actions;

export default userSlice.reducer;