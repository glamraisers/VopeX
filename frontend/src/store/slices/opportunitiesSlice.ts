import { 
  createSlice, 
  PayloadAction, 
  createAsyncThunk 
} from '@reduxjs/toolkit';
import { apiService } from '../../services/api/baseApiService';
import { predictionEngine } from '../../services/ai/predictionEngine';

// Opportunity interface
export interface Opportunity {
  id: string;
  name: string;
  description?: string;
  customer: {
    id: string;
    name: string;
  };
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  expectedRevenue: number;
  probability: number;
  predictiveInsights?: {
    closeProbability: number;
    riskFactor: number;
    recommendedActions: string[];
  };
  owner: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  expectedCloseDate?: Date;
}

// State interface
interface OpportunitiesState {
  opportunities: Opportunity[];
  selectedOpportunity: Opportunity | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  filters: {
    stage?: string;
    minRevenue?: number;
    maxRevenue?: number;
  };
}

// Initial state
const initialState: OpportunitiesState = {
  opportunities: [],
  selectedOpportunity: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  },
  filters: {}
};

// Async Thunks
export const fetchOpportunities = createAsyncThunk(
  'opportunities/fetchOpportunities',
  async (
    params: { 
      page?: number; 
      pageSize?: number; 
      filters?: OpportunitiesState['filters'] 
    } = {}, 
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.get<{
        data: Opportunity[];
        total: number;
        page: number;
        pageSize: number;
      }>('/opportunities', { 
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 10,
          ...params.filters
        }
      });

      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch opportunities');
    }
  }
);

export const createOpportunity = createAsyncThunk(
  'opportunities/createOpportunity',
  async (opportunityData: Partial<Opportunity>, { rejectWithValue }) => {
    try {
      const newOpportunity = await apiService.post<Partial<Opportunity>, Opportunity>(
        '/opportunities', 
        opportunityData
      );
      return newOpportunity;
    } catch (error) {
      return rejectWithValue('Failed to create opportunity');
    }
  }
);

export const updateOpportunity = createAsyncThunk(
  'opportunities/updateOpportunity',
  async ({ 
    id, 
    opportunityData 
  }: { 
    id: string; 
    opportunityData: Partial<Opportunity> 
  }, { rejectWithValue }) => {
    try {
      const updatedOpportunity = await apiService.put<Partial<Opportunity>, Opportunity>(
        `/opportunities/${id}`, 
        opportunityData
      );
      return updatedOpportunity;
    } catch (error) {
      return rejectWithValue('Failed to update opportunity');
    }
  }
);

export const predictOpportunityOutcome = createAsyncThunk(
  'opportunities/predictOutcome',
  async (opportunityId: string, { rejectWithValue }) => {
    try {
      const prediction = await predictionEngine.predictOpportunity(opportunityId);
      return { opportunityId, prediction };
    } catch (error) {
      return rejectWithValue('Failed to predict opportunity outcome');
    }
  }
);

// Slice
const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    selectOpportunity: (state, action: PayloadAction<string>) => {
      state.selectedOpportunity = state.opportunities.find(
        opportunity => opportunity.id === action.payload
      ) || null;
    },
    clearSelectedOpportunity: (state) => {
      state.selectedOpportunity = null;
    },
    setFilters: (state, action: PayloadAction<OpportunitiesState['filters']>) => {
      state.filters = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch Opportunities
    builder.addCase(fetchOpportunities.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOpportunities.fulfilled, (state, action) => {
      state.loading = false;
      state.opportunities = action.payload.data;
      state.pagination = {
        page: action.payload.page,
        pageSize: action.payload.pageSize,
        total: action.payload.total
      };
    });
    builder.addCase(fetchOpportunities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Opportunity
    builder.addCase(createOpportunity.fulfilled, (state, action) => {
      state.opportunities.push(action.payload);
    });

    // Update Opportunity
    builder.addCase(updateOpportunity.fulfilled, (state, action) => {
      const index = state.opportunities.findIndex(
        opportunity => opportunity.id === action.payload.id
      );
      if (index !== -1) {
        state.opportunities[index] = action.payload;
      }
    });

    // Predict Opportunity Outcome
    builder.addCase(predictOpportunityOutcome.fulfilled, (state, action) => {
      const index = state.opportunities.findIndex(
        opportunity => opportunity.id === action.payload.opportunityId
      );
      if (index !== -1 && action.payload.prediction) {
        state.opportunities[index].predictiveInsights = {
          closeProbability: action.payload.prediction.closeProbability,
          riskFactor: action.payload.prediction.riskFactor,
          recommendedActions: action.payload.prediction.recommendedActions
        };
      }
    });
  }
});

export const { 
  selectOpportunity, 
  clearSelectedOpportunity,
  setFilters
} = opportunitiesSlice.actions;

export default opportunitiesSlice.reducer;