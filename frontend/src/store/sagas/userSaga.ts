import { 
  call, 
  put, 
  takeLatest, 
  select, 
  all, 
  fork 
} from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/api/baseApiService';
import { authService } from '../../services/auth/authService';

// Import action types and action creators
import {
  fetchUserProfile,
  updateUserProfile,
  updateUserPreferences,
  setProfilePicture
} from '../slices/userSlice';

// Saga for fetching user profile
function* fetchUserProfileSaga() {
  try {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    const profile = yield call(
      apiService.get, 
      `/users/${user.id}`
    );

    yield put(fetchUserProfile.fulfilled(profile));
  } catch (error) {
    yield put(fetchUserProfile.rejected(error));
  }
}

// Saga for updating user profile
function* updateUserProfileSaga(action: PayloadAction<any>) {
  try {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    const updatedProfile = yield call(
      apiService.put, 
      `/users/${user.id}`, 
      action.payload
    );

    yield put(updateUserProfile.fulfilled(updatedProfile));
  } catch (error) {
    yield put(updateUserProfile.rejected(error));
  }
}

// Saga for updating user preferences
function* updateUserPreferencesSaga(action: PayloadAction<any>) {
  try {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    const updatedPreferences = yield call(
      apiService.patch, 
      `/users/${user.id}/preferences`, 
      action.payload
    );

    yield put(updateUserPreferences.fulfilled(updatedPreferences));
  } catch (error) {
    yield put(updateUserPreferences.rejected(error));
  }
}

// Saga for uploading profile picture
function* uploadProfilePictureSaga(action: PayloadAction<File>) {
  try {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    // Create form data for file upload
    const formData = new FormData();
    formData.append('profilePicture', action.payload);

    const uploadResponse = yield call(
      apiService.post, 
      `/users/${user.id}/profile-picture`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    // Update profile picture in state
    yield put(setProfilePicture(uploadResponse.profilePictureUrl));
  } catch (error) {
    console.error('Profile picture upload failed', error);
  }
}

// Saga for tracking user activity
function* trackUserActivitySaga() {
  while (true) {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        yield call(
          apiService.post, 
          `/users/${user.id}/activity`, 
          {
            timestamp: new Date().toISOString(),
            action: 'heartbeat'
          }
        );
      }

      // Send heartbeat every 5 minutes
      yield call(delay, 5 * 60 * 1000);
    } catch (error) {
      console.error('User activity tracking failed', error);
      // Continue tracking even if one heartbeat fails
    }
  }
}

// Saga for syncing user data across devices
function* userDataSyncSaga() {
  while (true) {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        // Fetch latest user data from server
        const latestUserData = yield call(
          apiService.get, 
          `/users/${user.id}/sync`
        );

        // Update local state if there are changes
        const currentUserState = yield select(state => state.user.profile);
        
        if (JSON.stringify(latestUserData) !== JSON.stringify(currentUserState)) {
          yield put(fetchUserProfile.fulfilled(latestUserData));
        }
      }

      // Sync every 10 minutes
      yield call(delay, 10 * 60 * 1000);
    } catch (error) {
      console.error('User data sync failed', error);
    }
  }
}

// Watcher saga
function* watchUserActions() {
  yield all([
    takeLatest(fetchUserProfile.pending.type, fetchUserProfileSaga),
    takeLatest(updateUserProfile.pending.type, updateUserProfileSaga),
    takeLatest(updateUserPreferences.pending.type, updateUserPreferencesSaga),
    takeLatest('user/uploadProfilePicture', uploadProfilePictureSaga)
  ]);
}

// Root user saga
export default function* userSaga() {
  yield all([
    fork(watchUserActions),
    fork(trackUserActivitySaga),
    fork(userDataSyncSaga)
  ]);
}

// Utility delay function for periodic tasks
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}