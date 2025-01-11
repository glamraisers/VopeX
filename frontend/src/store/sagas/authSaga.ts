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
import { authService } from '../../services/auth/authService';
import { apiService } from '../../services/api/baseApiService';
import { behaviorIntelligenceService } from '../../services/ai/behaviorIntelligenceService';

// Advanced Authentication Interfaces
interface LoginPayload {
  email: string;
  password: string;
  deviceFingerprint?: string;
}

interface PasswordResetPayload {
  email: string;
  resetToken?: string;
  newPassword?: string;
}

interface MultiFactorAuthPayload {
  email: string;
  verificationCode: string;
}

// Enhanced Auth Slice Actions
export const enhancedLoginRequest = (payload: LoginPayload) => ({
  type: 'auth/enhancedLoginRequest',
  payload
});

export const multiFactorAuthRequest = (payload: MultiFactorAuthPayload) => ({
  type: 'auth/multiFactorAuthRequest',
  payload
});

// Enhanced Authentication Saga
function* enhancedLoginSaga(action: PayloadAction<LoginPayload>) {
  try {
    const { email, password, deviceFingerprint } = action.payload;
    
    // Collect behavioral signals before login
    const behavioralSignals = yield call(
      behaviorIntelligenceService.collectLoginBehavioralSignals, 
      email
    );

    // Perform risk assessment
    const riskAssessment = yield call(
      apiService.post, 
      '/auth/risk-assessment', 
      { 
        email, 
        behavioralSignals,
        deviceFingerprint 
      }
    );

    // Conditional login based on risk assessment
    if (riskAssessment.riskLevel > 0.7) {
      // Trigger multi-factor authentication
      yield put({
        type: 'auth/triggerMultiFactorAuth',
        payload: { email }
      });
      return;
    }

    // Proceed with standard login
    const response = yield call(authService.login, { email, password });

    // Advanced login tracking
    yield call(
      behaviorIntelligenceService.trackLoginEvent, 
      response.user.id, 
      'successful_login'
    );

    yield put(loginSuccess({
      token: response.token,
      user: response.user,
      loginMetadata: {
        timestamp: new Date().toISOString(),
        deviceFingerprint,
        location: riskAssessment.location
      }
    }));
  } catch (error: any) {
    // Advanced error handling
    yield call(
      behaviorIntelligenceService.trackLoginEvent, 
      email, 
      'failed_login'
    );

    yield put(loginFailure({
      message: error.message,
      errorType: error.type || 'LOGIN_FAILED',
      retryAvailable: error.retryAvailable || false
    }));
  }
}

// Multi-Factor Authentication Saga
function* multiFactorAuthSaga(action: PayloadAction<MultiFactorAuthPayload>) {
  try {
    const { email, verificationCode } = action.payload;

    // Verify multi-factor authentication code
    const response = yield call(
      apiService.post, 
      '/auth/verify-mfa', 
      { email, verificationCode }
    );

    if (response.verified) {
      // Complete login process
      yield put({
        type: 'auth/completeMFALogin',
        payload: { email }
      });
    } else {
      yield put({
        type: 'auth/mfaVerificationFailed',
        payload: { email }
      });
    }
  } catch (error: any) {
    yield put({
      type: 'auth/mfaVerificationError',
      payload: { 
        email, 
        error: error.message 
      }
    });
  }
}

// Password Reset Saga
function* passwordResetSaga(action: PayloadAction<PasswordResetPayload>) {
  try {
    const { email, resetToken, newPassword } = action.payload;

    if (resetToken && newPassword) {
      // Complete password reset
      yield call(
        apiService.post, 
        '/auth/reset-password', 
        { email, resetToken, newPassword }
      );

      yield put({
        type: 'auth/passwordResetSuccess',
        payload: { email }
      });
    } else {
      // Initiate password reset request
      yield call(
        apiService.post, 
        '/auth/password-reset-request', 
        { email }
      );

      yield put({
        type: 'auth/passwordResetRequestSent',
        payload: { email }
      });
    }
  } catch (error: any) {
    yield put({
      type: 'auth/passwordResetFailed',
      payload: { 
        email, 
        error: error.message 
      }
    });
  }
}

// Advanced Security Watcher Saga
function* securityMonitoringSaga() {
  while (true) {
    try {
      // Periodic security checks
      const user = yield select(state => state.auth.user);
      
      if (user) {
        const securityCheck = yield call(
          apiService.get, 
          `/auth/security-check/${user.id}`
        );

        if (securityCheck.compromised) {
          yield put({
            type: 'auth/triggerSecurityAlert',
            payload: securityCheck
          });
        }
      }

      // Check every 30 minutes
      yield call(delay, 30 * 60 * 1000);
    } catch (error) {
      console.error('Security monitoring failed', error);
    }
  }
}

// Watcher Saga
function* watchEnhancedAuthActions() {
  yield all([
    takeLatest('auth/enhancedLoginRequest', enhancedLoginSaga),
    takeLatest('auth/multiFactorAuthRequest', multiFactorAuthSaga),
    takeLatest('auth/initiatePasswordReset', passwordResetSaga)
  ]);
}

// Root Enhanced Auth Saga
export default function* enhancedAuthSaga() {
  yield all([
    fork(watchEnhancedAuthActions),
    fork(securityMonitoringSaga)
  ]);
}