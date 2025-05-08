import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  SelectChangeEvent,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { selectSettings } from '../features/heartRateZones/heartRateZonesSlice';

export interface ZoneSettings {
  restingHR: number;
  maxHR: number;
  zoneMethod: 'percentage' | 'lactate' | 'power';
}

interface ZoneMethod {
  value: 'percentage' | 'lactate' | 'power';
  label: string;
}

const zoneMethods: ZoneMethod[] = [
  { value: 'percentage', label: 'Percentage of Max HR' },
  { value: 'lactate', label: 'Lactate Threshold' },
  { value: 'power', label: 'Power Zones' },
];

export const ZoneSettingsDialog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const zones = useSelector((state: RootState) => state.heartRateZones.zones);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<ZoneSettings>({
    restingHR: 60,
    maxHR: 180,
    zoneMethod: 'percentage',
  });

  useEffect(() => {
    if (Object.keys(zones).length > 0) {
      const firstZone = zones[0];
      setSettings({
        restingHR: firstZone.min,
        maxHR: firstZone.max,
        zoneMethod: 'percentage'
      });
    }
  }, [zones]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    dispatch({ type: 'heartRateZones/setSettings', payload: settings });
    handleClose();
  };

  const handleZoneMethodChange = (event: SelectChangeEvent<'percentage' | 'lactate' | 'power'>) => {
    setSettings({ ...settings, zoneMethod: event.target.value as 'percentage' | 'lactate' | 'power' });
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        <Chip label="Zone Settings" color="primary" size="small" />
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Heart Rate Zone Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Heart Rate Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Resting Heart Rate"
                type="number"
                fullWidth
                value={settings.restingHR}
                onChange={(e) =>
                  setSettings({ ...settings, restingHR: parseInt(e.target.value) })
                }
                helperText="Your average resting heart rate (bpm)"
                InputProps={{
                  inputProps: { min: 30, max: 100 },
                }}
              />
              <TextField
                label="Maximum Heart Rate"
                type="number"
                fullWidth
                value={settings.maxHR}
                onChange={(e) =>
                  setSettings({ ...settings, maxHR: parseInt(e.target.value) })
                }
                helperText="Your maximum heart rate during exercise (bpm)"
                InputProps={{
                  inputProps: { min: 120, max: 220 },
                }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Zone Calculation Method
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Zone Method</InputLabel>
              <Select
                value={settings.zoneMethod}
                label="Zone Method"
                onChange={handleZoneMethodChange}
              >
                {zoneMethods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Note: Changing the zone calculation method will recalculate all zones based on the selected method.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
