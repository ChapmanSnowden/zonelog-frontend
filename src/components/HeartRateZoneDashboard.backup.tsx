import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Chip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { calculateZones } from '../features/heartRateZones/heartRateZonesSlice';
import { selectActivities } from '../features/activities/activitiesSlice';
import HeartRateZoneChart from './HeartRateZoneChart';
import { ZoneSettingsDialog } from './ZoneSettings';
import { HeartRateZone } from '../features/heartRateZones/heartRateZonesSlice';
import { RootState, AppDispatch } from '../store';
import { Activity } from '../types/store';

interface TimePeriod {
  label: string;
  days: number;
}

const timePeriods: TimePeriod[] = [
  { label: 'Today', days: 1 },
  { label: '2 Days', days: 2 },
  { label: 'This Week', days: 7 },
  { label: '2 Weeks', days: 14 },
  { label: 'This Month', days: 30 },
];

const getColorForZone = (zone: string): string => {
  switch (zone) {
    case 'Zone 1': return '#4CAF50';
    case 'Zone 2': return '#2196F3';
    case 'Zone 3': return '#FFC107';
    case 'Zone 4': return '#FF9800';
    case 'Zone 5': return '#F44336';
    default: return '#9E9E9E';
  }
};

const getZoneMin = (zone: string): number => {
  switch (zone) {
    case 'Zone 1': return 0;
    case 'Zone 2': return 121;
    case 'Zone 3': return 141;
    case 'Zone 4': return 161;
    case 'Zone 5': return 181;
    default: return 0;
  }
};

const getZoneMax = (zone: string): number => {
  switch (zone) {
    case 'Zone 1': return 120;
    case 'Zone 2': return 140;
    case 'Zone 3': return 160;
    case 'Zone 4': return 180;
    case 'Zone 5': return 200;
    default: return 200;
  }
};

export const HeartRateZoneDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const activities = useSelector(selectActivities);
  const zones = useSelector((state: RootState) => state.heartRateZones.zones);
  const loading = useSelector((state: RootState) => state.heartRateZones.loading);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(timePeriods[0]);

  const handleTimePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    // Filter activities based on selected time period
    const filteredActivities = activities.filter((activity: Activity) => {
      const activityDate = new Date(activity.start_date);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - period.days);
      return activityDate >= cutoffDate;
    });

    // Calculate total duration
    const totalDuration = filteredActivities.reduce((sum: number, activity: Activity) => {
      return sum + (activity.moving_time || 0);
    }, 0);

    // Calculate zones for this time period
    dispatch(calculateZones(filteredActivities) as any);
  };

  const handleConnectStrava = () => {
    // Redirect to Strava OAuth URL
    window.location.href = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth/strava/callback';
  };

  const formatZonesForChart = (): HeartRateZone[] => {
    if (!zones) return [];
    return Object.entries(zones).map(([zone, time]) => ({
      name: zone,
      time: time as unknown as number,
      color: getColorForZone(zone),
      min: getZoneMin(zone),
      max: getZoneMax(zone)
    }));
  };

  const getZoneMin = (zone: string) => {
    switch (zone) {
      case 'Zone 1':
        return 0;
      case 'Zone 2':
        return 121;
      case 'Zone 3':
        return 141;
      case 'Zone 4':
        return 161;
      case 'Zone 5':
        return 181;
      default:
        return 0;
    }
  };

  const getZoneMax = (zone: string) => {
    switch (zone) {
      case 'Zone 1':
        return 120;
      case 'Zone 2':
        return 140;
      case 'Zone 3':
        return 160;
      case 'Zone 4':
        return 180;
      case 'Zone 5':
        return 200;
      default:
        return 200;
    }
  };

  const getColorForZone = (zone: string) => {
    switch (zone) {
      case 'Zone 1':
        return '#4CAF50';
      case 'Zone 2':
        return '#2196F3';
      case 'Zone 3':
        return '#FFC107';
      case 'Zone 4':
        return '#FF5722';
      case 'Zone 5':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Heart Rate Zone Analysis
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConnectStrava}
          sx={{ mr: 2 }}
        >
          Connect with Strava
        </Button>
        <ZoneSettingsDialog />
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Time Period Selection
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {timePeriods.map((period) => (
            <Button
              key={period.label}
              variant={selectedPeriod.label === period.label ? 'contained' : 'outlined'}
              fullWidth
              onClick={() => handleTimePeriodChange(period)}
            >
              {period.label}
            </Button>
          ))}
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Zone Summary" />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {zones?.map((zone: HeartRateZone, index: number) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={zone.name}
                    color="primary"
                    sx={{ flex: 1 }}
                  />
                  <Typography variant="body1">
                    {zone.time} sec ({((zone.time / activities.reduce((sum: number, activity: any) => sum + (activity.moving_time || 0), 0)) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
              ))}
            </Box>
            </CardContent>
          </Card>

          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Zone Distribution
            </Typography>
            <HeartRateZoneChart 
              zones={formatZonesForChart()}
              totalDuration={activities.reduce((sum: number, activity: any) => sum + (activity.moving_time || 0), 0)} 
            />
          </Box>
        </>
      )}
    </Box>
  );
};
