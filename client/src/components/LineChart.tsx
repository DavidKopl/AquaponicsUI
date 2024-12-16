import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

let lastValidValue: number | null = null;

const getLastValidValue = (data: (number | null)[]) => {
  if (lastValidValue !== null) {
    return lastValidValue;
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i] != null) {
      lastValidValue = data[i];
      return lastValidValue;
    }
  }

  return null;
};

export default function DifferentLength() {
  const [chartData, setChartData] = useState<{ x: number[]; y: (number | null)[][] }>({
    x: [],
    y: [],
  });

  useEffect(() => {
    // Fetchování dat z API
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/data/sensor_data'); // Změňte URL podle potřeby
        const data = await response.json();

        console.log('data: ', data);
        // Zpracování dat do formátu pro graf
        const xValues: number[] = data.map((_: any, index: number) => index + 1); // Generování X hodnot
        const yValues: (number | null)[][] = data.map((entry: any) => [entry.temperature, entry.humidity, entry.co2, entry.ec, entry.ph]);
        // console.log(xValues, yValues);

        setChartData({ x: xValues, y: yValues });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // console.log(chartData.x);
  return (
    <LineChart
      xAxis={[{ data: chartData.x }]}
      series={chartData.y.map((seriesData, seriesIndex) => ({
        data: seriesData,
        valueFormatter: (value, context) => {
          const lastValidValue = getLastValidValue(seriesData);
          return value == null ? (lastValidValue != null ? lastValidValue.toString() : 'NaN') : value.toString();
        },
      }))}
      height={300}
      margin={{ top: 10, bottom: 20 }}
    />
  );
}

// export default function DifferentLength() {
//   const seriesData = [{ data: [2, 5.5, 2, 8.5, 1.5, 5] }, { data: [null, null, null, null, 5.5, 2, 8.5, 1.5, 5] }, { data: [7, 8, 5, 4, null, null, 2, 5.5, 1] }];

//   return (
//     <LineChart
//       xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15, 16] }]}
//       series={seriesData.map((series, seriesIndex) => ({
//         ...series,
//         valueFormatter: (value, context) => {
//           // Získání dat pro aktuální sérii
//           const data = seriesData[seriesIndex].data;
//           const lastValidValue = getLastValidValue(data);
//           return value == null ? (lastValidValue != null ? lastValidValue.toString() : 'NaN') : value.toString();
//         },
//       }))}
//       height={300}
//       margin={{ top: 10, bottom: 20 }}
//     />
//   );
// }
