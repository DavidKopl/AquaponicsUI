import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { format } from 'date-fns';

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

        // Převeďte timestamp na Date objekty
        const xValues: number[] = data.map((entry: any) => new Date(entry.timestamp).getTime()); // Převeďte na timestamp (číslo)

        // Zpracování hodnot pro každou kategorii (teplota, vlhkost, CO2, EC, pH)
        const yValues: (number | null)[][] = data.map((entry: any) => [
          entry.temperature, // Teplota
          entry.humidity, // Vlhkost
          entry.co2, // CO2
          entry.ec, // EC
          entry.ph, // pH
        ]);

        console.log('xValues: ', xValues);
        console.log('yValues: ', yValues);

        setChartData({ x: xValues, y: yValues });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <LineChart
      xAxis={[
        {
          scaleType: 'utc',
          data: chartData.x,
        },
      ]}
      series={[
        // Teplota
        {
          data: chartData.y.map((values) => values[0]),
          valueFormatter: (value, context) => {
            const lastValidValue = getLastValidValue(chartData.y.map((values) => values[0]));
            return value == null ? (lastValidValue != null ? lastValidValue.toString() : 'NaN') : value.toString();
          },
        },
        // Vlhkost
        {
          data: chartData.y.map((values) => values[1]),
          valueFormatter: (value, context) => {
            const lastValidValue = getLastValidValue(chartData.y.map((values) => values[1]));
            return value == null ? (lastValidValue != null ? lastValidValue.toString() : 'NaN') : value.toString();
          },
        },
        // CO2
        // {
        //   data: chartData.y.map((values) => values[2]),
        //   valueFormatter: (value, context) => {
        //     const lastValidValue = getLastValidValue(chartData.y.map((values) => values[2]));
        //     return value == null ? (lastValidValue != null ? lastValidValue.toString() : 'NaN') : value.toString();
        //   },
        // },
        // EC
        // {
        //   data: chartData.y.map((values) => values[3]),
        //   valueFormatter: (value, context) => {
        //     const lastValidValue = getLastValidValue(chartData.y.map((values) => values[3]));
        //     return value == null ? (lastValidValue != null ? lastValidValue.toString() : 'NaN') : value.toString();
        //   },
        // },
        // // pH
        // {
        //   data: chartData.y.map((values) => values[4]),
        //   valueFormatter: (value, context) => {
        //     const lastValidValue = getLastValidValue(chartData.y.map((values) => values[4]));
        //     return value == null ? (lastValidValue != null ? lastValidValue.toString() : 'NaN') : value.toString();
        //   },
        // },
      ]}
      height={300}
      margin={{ top: 10, bottom: 20 }}
    />
  );
}
