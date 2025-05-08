import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface HeartRateZone {
  name: string;
  min: number;
  max: number;
  time: number;
  color: string;
}

export interface HeartRateZonesState {
  zones: HeartRateZone[];
  loading: boolean;
  error: string | null;
}

const initialState: HeartRateZonesState = {
  zones: [
    { name: 'Zone 1', min: 0, max: 120, time: 0, color: '#4CAF50' },
    { name: 'Zone 2', min: 121, max: 140, time: 0, color: '#2196F3' },
    { name: 'Zone 3', min: 141, max: 160, time: 0, color: '#FFC107' },
    { name: 'Zone 4', min: 161, max: 180, time: 0, color: '#FF9800' },
    { name: 'Zone 5', min: 181, max: 200, time: 0, color: '#F44336' },
  ],
  loading: false,
  error: null,
};

export const calculateZones = createAsyncThunk(
  'heartRateZones/calculate',
  async (activities: any[], { getState }) => {
    const state = getState() as RootState;
    const zones = state.heartRateZones.zones;
    
    // Reset all zone times
    zones.forEach(zone => zone.time = 0);

    // Calculate time in each zone
    activities.forEach(activity => {
      const heartRateData = activity.heartrate;
      if (heartRateData) {
        heartRateData.forEach((hr: number) => {
          zones.forEach(zone => {
            if (hr >= zone.min && hr <= zone.max) {
              zone.time += 1; // Assuming data is in seconds
            }
          });
        });
      }
    });

    return zones;
  }
);

export const heartRateZonesSlice = createSlice({
  name: 'heartRateZones',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(calculateZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateZones.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = action.payload;
      })
      .addCase(calculateZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to calculate zones';
      });
  },
});

export const selectSettings = (state: RootState) => state.heartRateZones;

export default heartRateZonesSlice.reducer;
