import { all, fork } from 'redux-saga/effects';

// Import individual saga modules
import authSaga from './authSaga';
import userSaga from './userSaga';
import leadSaga from './leadSaga';
import opportunitySaga from './opportunitySaga';
import settingsSaga from './settingsSaga';
import aiPredictionSaga from './aiPredictionSaga';

// Monitoring and logging saga
function* monitoringSaga() {
  while (true) {
    try {
      // Periodic system health check
      yield call(apiService.get, '/system/health');
      
      // Log saga performance metrics
      yield call(logSagaPerformance);
    } catch (error) {
      console.error('Saga monitoring failed', error);
    }
    
    // Check every 15 minutes
    yield delay(15 * 60 * 1000);
  }
}

// Performance logging function
function* logSagaPerformance() {
  const sagaMetrics = {
    timestamp: new Date().toISOString(),
    sagas: {
      auth: calculateSagaPerformance(authSaga),
      user: calculateSagaPerformance(userSaga),
      leads: calculateSagaPerformance(leadSaga),
      opportunities: calculateSagaPerformance(opportunitySaga)
    }
  };

  // Send metrics to monitoring service
  yield call(apiService.post, '/system/saga-metrics', sagaMetrics);
}

// Calculate saga performance
function calculateSagaPerformance(saga: any) {
  // Implement performance tracking logic
  return {
    executionCount: saga.executionCount || 0,
    averageExecutionTime: saga.averageExecutionTime || 0,
    lastExecutionTimestamp: saga.lastExecutionTimestamp || null
  };
}

// Error handling middleware saga
function* errorHandlingSaga() {
  yield takeEvery('*', function* (action) {
    try {
      if (action.type.endsWith('/rejected')) {
        // Central error logging and reporting
        yield call(reportErrorToMonitoringService, {
          actionType: action.type,
          error: action.payload,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Central error handling failed', error);
    }
  });
}

// Centralized error reporting
function* reportErrorToMonitoringService(errorData: any) {
  try {
    yield call(apiService.post, '/monitoring/errors', errorData);
  } catch (reportError) {
    console.error('Failed to report error', reportError);
  }
}

// Periodic data synchronization saga
function* dataSyncSaga() {
  while (true) {
    try {
      // Trigger synchronization for different modules
      yield all([
        put({ type: 'leads/sync' }),
        put({ type: 'opportunities/sync' }),
        put({ type: 'user/sync' })
      ]);
    } catch (error) {
      console.error('Data synchronization failed', error);
    }
    
    // Sync every hour
    yield delay(60 * 60 * 1000);
  }
}

// Root saga configuration
export default function* rootSaga() {
  yield all([
    // Core business logic sagas
    fork(authSaga),
    fork(userSaga),
    fork(leadSaga),
    fork(opportunitySaga),
    fork(settingsSaga),
    fork(aiPredictionSaga),

    // System-level sagas
    fork(monitoringSaga),
    fork(errorHandlingSaga),
    fork(dataSyncSaga)
  ]);
}

// Saga middleware configuration
export const sagaMiddleware = createSagaMiddleware({
  // Advanced error handling
  onError: (error, errorInfo) => {
    // Log unhandled saga errors
    console.error('Unhandled Saga Error:', error, errorInfo);
    
    // Optional: Send critical error to monitoring service
    apiService.post('/monitoring/critical-errors', {
      error: error.toString(),
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});