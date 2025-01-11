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
import { predictionEngine } from '../../services/ai/predictionEngine';

// Import action types and action creators
import {
  fetchLeads,
  createLead,
  updateLead,
  predictLeadScore,
  selectLead
} from '../slices/leadsSlice';

// Saga for fetching leads
function* fetchLeadsSaga(action: PayloadAction<{
  page?: number;
  pageSize?: number;
  filters?: Record<string, any>
}>) {
  try {
    const response = yield call(
      apiService.get, 
      '/leads', 
      { 
        params: {
          page: action.payload?.page || 1,
          pageSize: action.payload?.pageSize || 10,
          ...action.payload?.filters
        }
      }
    );

    yield put(fetchLeads.fulfilled(response));
  } catch (error) {
    yield put(fetchLeads.rejected(error));
  }
}

// Saga for creating a lead
function* createLeadSaga(action: PayloadAction<any>) {
  try {
    const newLead = yield call(
      apiService.post, 
      '/leads', 
      action.payload
    );

    yield put(createLead.fulfilled(newLead));

    // Automatically predict lead score after creation
    yield put(predictLeadScore(newLead.id));
  } catch (error) {
    yield put(createLead.rejected(error));
  }
}

// Saga for updating a lead
function* updateLeadSaga(action: PayloadAction<{
  id: string;
  leadData: any;
}>) {
  try {
    const { id, leadData } = action.payload;
    const updatedLead = yield call(
      apiService.put, 
      `/leads/${id}`, 
      leadData
    );

    yield put(updateLead.fulfilled(updatedLead));

    // Automatically predict lead score after update
    yield put(predictLeadScore(id));
  } catch (error) {
    yield put(updateLead.rejected(error));
  }
}

// Saga for predicting lead score
function* predictLeadScoreSaga(action: PayloadAction<string>) {
  try {
    const leadId = action.payload;
    const prediction = yield call(
      predictionEngine.predictLeadScore, 
      leadId
    );

    // Update lead with prediction results
    yield put(predictLeadScore.fulfilled({
      leadId,
      prediction
    }));
  } catch (error) {
    yield put(predictLeadScore.rejected(error));
  }
}

// Saga for handling lead selection
function* handleLeadSelectionSaga(action: PayloadAction<string>) {
  try {
    // Perform additional actions when a lead is selected
    const selectedLead = yield select(
      state => state.leads.leads.find(lead => lead.id === action.payload)
    );

    // Example: Fetch additional lead details or related data
    if (selectedLead) {
      // You can add more complex logic here
      console.log('Selected Lead:', selectedLead);
    }
  } catch (error) {
    console.error('Lead selection error', error);
  }
}

// Batch lead score prediction saga
function* batchLeadScorePredictionSaga() {
  try {
    // Select leads without existing predictions
    const leadsWithoutPrediction = yield select(
      state => state.leads.leads.filter(lead => !lead.score)
    );

    // Predict scores for leads without existing predictions
    yield all(
      leadsWithoutPrediction.map(lead => 
        put(predictLeadScore(lead.id))
      )
    );
  } catch (error) {
    console.error('Batch lead score prediction failed', error);
  }
}

// Watcher saga
function* watchLeadActions() {
  yield all([
    takeLatest(fetchLeads.pending.type, fetchLeadsSaga),
    takeLatest(createLead.pending.type, createLeadSaga),
    takeLatest(updateLead.pending.type, updateLeadSaga),
    takeLatest(predictLeadScore.pending.type, predictLeadScoreSaga),
    takeLatest(selectLead.type, handleLeadSelectionSaga)
  ]);
}

// Periodic batch prediction saga
function* periodicBatchPredictionSaga() {
  while (true) {
    yield call(batchLeadScorePredictionSaga);
    // Run batch prediction every 30 minutes
    yield call(delay, 30 * 60 * 1000);
  }
}

// Root lead saga
export default function* leadSaga() {
  yield all([
    fork(watchLeadActions),
    fork(periodicBatchPredictionSaga)
  ]);
}

// Utility delay function for periodic tasks
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}