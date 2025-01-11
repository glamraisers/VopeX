import { 
  createSlice, 
  PayloadAction, 
  createAsyncThunk 
} from '@reduxjs/toolkit';
import { apiService } from '../../services/api/baseApiService';
import { predictionEngine } from '../../services/ai/predictionEngine';

// Lead interface
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'qualified' | 'contacted' | 'converted' | 'lost';
  score?: number;
  predictiveInsights?: {
    conversionProbability: number;
    recommendedAction: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// State interface
interface LeadsState {
  leads: Lead[];
  selectedLead: Lead | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

// Initial state
const initialState: LeadsState = {
  leads: [],
  selectedLead: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  }
};

// Async Thunks
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (
    params: { 
      page?: number; 
      pageSize?: number; 
      filters?: Record<string, any> 
    } = {}, 
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.get<{
        data: Lead[];
        total: number;
        page: number;
        pageSize: number;
      }>('/leads', { 
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 10,
          ...params.filters
        }
      });

      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch leads');
    }
  }
);

export const createLead = createAsyncThunk(
  'leads/createLead',
  async (leadData: Partial<Lead>, { rejectWithValue }) => {
    try {
      const newLead = await apiService.post<Partial<Lead>, Lead>('/leads', leadData);
      return newLead;
    } catch (error) {
      return rejectWithValue('Failed to create lead');
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ 
    id, 
    leadData 
  }: { 
    id: string; 
    leadData: Partial<Lead> 
  }, { rejectWithValue }) => {
    try {
      const updatedLead = await apiService.put<Partial<Lead>, Lead>(`/leads/${id}`, leadData);
      return updatedLead;
    } catch (error) {
      return rejectWithValue('Failed to update lead');
    }
  }
);

export const predictLeadScore = createAsyncThunk(
  'leads/predictLeadScore',
  async (leadId: string, { rejectWithValue }) => {
    try {
      const prediction = await predictionEngine.predictLeadScore(leadId);
      return { leadId, prediction };
    } catch (error) {
      return rejectWithValue('Failed to predict lead score');
    }
  }
);

// Slice
const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    selectLead: (state, action: PayloadAction<string>) => {
      state.selectedLead = state.leads.find(lead => lead.id === action.payload) || null;
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Leads
    builder.addCase(fetchLeads.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchLeads.fulfilled, (state, action) => {
      state.loading = false;
      state.leads = action.payload.data;
      state.pagination = {
        page: action.payload.page,
        pageSize: action.payload.pageSize,
        total: action.payload.total
      };
    });
    builder.addCase(fetchLeads.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Lead
    builder.addCase(createLead.fulfilled, (state, action) => {
      state.leads.push(action.payload);
    });

    // Update Lead
    builder.addCase(updateLead.fulfilled, (state, action) => {
      const index = state.leads.findIndex(lead => lead.id === action.payload.id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
    });

    // Predict Lead Score
    builder.addCase(predictLeadScore.fulfilled, (state, action) => {
      const index = state.leads.findIndex(lead => lead.id === action.payload.leadId);
      if (index !== -1 && action.payload.prediction) {
        state.leads[index].score = action.payload.prediction.score;
        state.leads[index].predictiveInsights = {
          conversionProbability: action.payload.prediction.conversionProbability,
          recommendedAction: action.payload.prediction.insights[0]
        };
      }
    });
  }
});

export const { selectLead, clearSelectedLead } = leadsSlice.actions;
export default leadsSlice.reducer;