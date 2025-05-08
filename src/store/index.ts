import { configureStore } from '@reduxjs/toolkit';
import activitiesReducer from '../features/activities/activitiesSlice';
import heartRateZonesReducer from '../features/heartRateZones/heartRateZonesSlice';

export const store = configureStore({
  reducer: {
    activities: activitiesReducer,
    heartRateZones: heartRateZonesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
