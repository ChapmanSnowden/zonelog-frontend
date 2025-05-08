import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Activity {
  id: number;
  name: string;
  type: string;
  start_date: string;
  moving_time: number;
  heartrate?: number[];
  distance: number;
  average_heartrate?: number;
  max_heartrate?: number;
}

export interface ActivitiesState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
  activities: [],
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk(
  'activities/fetch',
  async () => {
    const response = await fetch('http://localhost:5000/api/activities');
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    return response.json();
  }
);

export const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activities';
      });
  },
});

export const selectActivities = (state: any) => state.activities.activities;

export default activitiesSlice.reducer;
