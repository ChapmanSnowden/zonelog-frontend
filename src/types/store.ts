export interface RootState {
  activities: {
    activities: Activity[];
    loading: boolean;
    error: string | null;
  };
  heartRateZones: {
    zones: Record<string, number>;
    loading: boolean;
  };
}

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

export interface HeartRateZone {
  name: string;
  time: number;
  color: string;
  min: number;
  max: number;
}
