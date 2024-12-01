import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

// Uchování poslední platné hodnoty
let lastValidValue: number | null = null;

const getLastValidValue = (data: (number | null)[]) => {
  if (lastValidValue !== null) {
    // Pokud už byla nalezena platná hodnota, vrátí ji
    return lastValidValue;
  }

  // Najde první platnou hodnotu
  for (let i = 0; i < data.length; i++) {
    if (data[i] != null) {
      lastValidValue = data[i]; // Uloží první platnou hodnotu
      return lastValidValue;
    }
  }

  return null; // Pokud není žádná platná hodnota, vrátí null
};

export default function DifferentLength() {
  const seriesData = [{ data: [2, 5.5, 2, 8.5, 1.5, 5] }, { data: [null, null, null, null, 5.5, 2, 8.5, 1.5, 5] }, { data: [7, 8, 5, 4, null, null, 2, 5.5, 1] }];

  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15, 16] }]}
      series={seriesData.map((series, seriesIndex) => ({
        ...series,
        valueFormatter: (value, context) => {
          // Získání dat pro aktuální sérii
          const data = seriesData[seriesIndex].data;
          const lastValidValue = getLastValidValue(data);
          return value == null ? (lastValidValue != null ? lastValidValue.toString() : 'NaN') : value.toString();
        },
      }))}
      height={300}
      margin={{ top: 10, bottom: 20 }}
    />
  );
}
