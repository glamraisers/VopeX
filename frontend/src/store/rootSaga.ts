import { all, fork } from 'redux-saga/effects';

// Import individual sagas
import authSaga from './sagas/authSaga';
import leadSaga from './sagas/leadSaga';
import opportunitySaga from './sagas/opportunitySaga';
import userSaga from './sagas/userSaga';

// Combine all sagas
export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(leadSaga),
    fork(opportunitySaga),
    fork(userSaga)
  ]);
}