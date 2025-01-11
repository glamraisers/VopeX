import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/auth/authService';
import { loginSuccess, logout } from '../slices/authSlice';

function* loginSaga(action: PayloadAction<{
  email: string;
  password: string;
}>) {
  try {
    const { email, password } = action.payload;
    const response = yield call(authService.login, { email, password });
    
    yield put(loginSuccess({
      token: response.token,
      user: response.user
    }));
  } catch (error) {
    // Handle login error
    console.error('Login failed', error);
  }
}

function* logoutSaga() {
  try {
    yield call(authService.logout);
    yield put(logout());
  } catch (error) {
    console.error('Logout failed', error);
  }
}

export default function* authSaga() {
  yield takeLatest('auth/login', loginSaga);
  yield takeLatest('auth/initiateLogout', logoutSaga);
}