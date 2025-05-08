import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { HeartRateZone } from '../features/heartRateZones/heartRateZonesSlice';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  zones: HeartRateZone[];
  totalDuration: number;
}

const HeartRateZoneChart: React.FC<Props> = ({ zones, totalDuration }) => {
  const data = {
    labels: zones.map(zone => zone.name),
    datasets: [
      {
        data: zones.map(zone => zone.time),
        backgroundColor: zones.map(zone => zone.color),
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const zone = zones[context.dataIndex];
            const percentage = ((zone.time / totalDuration) * 100).toFixed(1);
            return `${zone.name}: ${zone.time} min (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default HeartRateZoneChart;
