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
  fetchOpportunities,
  createOpportunity,
  updateOpportunity,
  predictOpportunityOutcome,
  selectOpportunity
} from '../slices/opportunitiesSlice';

// Saga for fetching opportunities
function* fetchOpportunitiesSaga(action: PayloadAction<{
  page?: number;
  pageSize?: number;
  filters?: Record<string, any>
}>) {
  try {
    const response = yield call(
      apiService.get, 
      '/opportunities', 
      { 
        params: {
          page: action.payload?.page || 1,
          pageSize: action.payload?.pageSize || 10,
          ...action.payload?.filters
        }
      }
    );

    yield put(fetchOpportunities.fulfilled(response));
  } catch (error) {
    yield put(fetchOpportunities.rejected(error));
  }
}

// Saga for creating an opportunity
function* createOpportunitySaga(action: PayloadAction<any>) {
  try {
    const newOpportunity = yield call(
      apiService.post, 
      '/opportunities', 
      action.payload
    );

    yield put(createOpportunity.fulfilled(newOpportunity));

    // Automatically predict opportunity outcome after creation
    yield put(predictOpportunityOutcome(newOpportunity.id));
  } catch (error) {
    yield put(createOpportunity.rejected(error));
  }
}

// Saga for updating an opportunity
function* updateOpportunitySaga(action: PayloadAction<{
  id: string;
  opportunityData: any;
}>) {
  try {
    const { id, opportunityData } = action.payload;
    const updatedOpportunity = yield call(
      apiService.put, 
      `/opportunities/${id}`, 
      opportunityData
    );

    yield put(updateOpportunity.fulfilled(updatedOpportunity));

    // Automatically predict opportunity outcome after update
    yield put(predictOpportunityOutcome(id));
  } catch (error) {
    yield put(updateOpportunity.rejected(error));
  }
}

// Saga for predicting opportunity outcome
function* predictOpportunityOutcomeSaga(action: PayloadAction<string>) {
  try {
    const opportunityId = action.payload;
    const prediction = yield call(
      predictionEngine.predictOpportunity, 
      opportunityId
    );

    // Update opportunity with prediction results
    yield put(predictOpportunityOutcome.fulfilled({
      opportunityId,
      prediction
    }));
  } catch (error) {
    yield put(predictOpportunityOutcome.rejected(error));
  }
}

// Saga for handling opportunity selection
function* handleOpportunitySelectionSaga(action: PayloadAction<string>) {
  try {
    // Perform additional actions when an opportunity is selected
    const selectedOpportunity = yield select(
      state => state.opportunities.opportunities.find(
        opportunity => opportunity.id === action.payload
      )
    );

    // Fetch additional opportunity details or related data
    if (selectedOpportunity) {
      // Example: Fetch related interactions or communications
      yield call(fetchOpportunityRelatedData, selectedOpportunity.id);
    }
  } catch (error) {
    console.error('Opportunity selection error', error);
  }
}

// Saga for fetching related opportunity data
function* fetchOpportunityRelatedData(opportunityId: string) {
  try {
    // Fetch additional details, interactions, communications, etc.
    const relatedInteractions = yield call(
      apiService.get, 
      `/opportunities/${opportunityId}/interactions`
    );

    const relatedCommunications = yield call(
      apiService.get, 
      `/opportunities/${opportunityId}/communications`
    );

    // Dispatch actions to update related data in the store if needed
    // yield put(updateOpportunityRelatedData({
    //   interactions: relatedInteractions,
    //   communications: relatedCommunications
    // }));
  } catch (error) {
    console.error('Failed to fetch related opportunity data', error);
  }
}

// Batch opportunity outcome prediction saga
function* batchOpportunityOutcomePredictionSaga() {
  try {
    // Select opportunities without existing predictions
    const opportunitiesWithoutPrediction = yield select(
      state => state.opportunities.opportunities.filter(
        opportunity => !opportunity.predictiveInsights
      )
    );

    // Predict outcomes for opportunities without existing predictions
    yield all(
      opportunitiesWithoutPrediction.map(opportunity => 
        put(predictOpportunityOutcome(opportunity.id))
      )
    );
  } catch (error) {
    console.error('Batch opportunity outcome prediction failed', error);
  }
}

// Watcher saga
function* watchOpportunityActions() {
  yield all([
    takeLatest(fetchOpportunities.pending.type, fetchOpportunitiesSaga),
    takeLatest(createOpportunity.pending.type, createOpportunitySaga),
    takeLatest(updateOpportunity.pending.type, updateOpportunitySaga),
    takeLatest(predictOpportunityOutcome.pending.type, predictOpportunityOutcomeSaga),
    takeLatest(selectOpportunity.type, handleOpportunitySelectionSaga)
  ]);
}

// Periodic batch prediction saga
function* periodicBatchPredictionSaga() {
  while (true) {
    yield call(batchOpportunityOutcomePredictionSaga);
    // Run batch prediction every 45 minutes
    yield call(delay, 45 * 60 * 1000);
  }
}

// Root opportunity saga
export default function* opportunitySaga() {
  yield all([
    fork(watchOpportunityActions),
    fork(periodicBatchPredictionSaga)
  ]);
}

// Utility delay function for periodic tasks
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}