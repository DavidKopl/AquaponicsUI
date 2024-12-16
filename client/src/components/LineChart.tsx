import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material'; // Import správného typu pro SelectChangeEvent
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
  const [granularity, setGranularity] = useState('hour'); // Výchozí granularita
  const [chartData, setChartData] = useState<{ x: number[]; y: (number | null)[][] }>({
    x: [],
    y: [],
  });

  // Funkce pro změnu granularity
  const handleGranularityChange = async (event: SelectChangeEvent<string>) => {
    const newGranularity = event.target.value;
    setGranularity(newGranularity);

    // Fetchování dat s novou granularitou
    await fetchData(newGranularity);
  };

  // Funkce pro fetchování dat z API
  const fetchData = async (granularity = '10min') => {
    try {
      const response = await fetch(`http://localhost:3001/data/sensor_data?granularity=${granularity}`);
      const data = await response.json();

      // Převeďte timestamp na Date objekty
      const xValues: number[] = data.map((entry: any) => new Date(entry.timestamp).getTime());

      // Zpracování hodnot pro každou kategorii (teplota, vlhkost, CO2, EC, pH)
      const yValues: (number | null)[][] = data.map((entry: any) => [
        entry.temperature, // Teplota
        entry.humidity, // Vlhkost
        entry.co2, // CO2
        entry.ec, // EC
        entry.ph, // pH
      ]);

      setChartData({ x: xValues, y: yValues });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(granularity); // Načíst data při prvním renderu
  }, [granularity]);

  return (
    <>
      {/* Dropdown pro výběr granularity */}
      <FormControl style={{ marginLeft: '20px' }} margin="normal">
        <InputLabel>Granularita</InputLabel>
        <Select value={granularity} onChange={handleGranularityChange} label="Granularita">
          <MenuItem value="minute">Minutová granularita</MenuItem>
          <MenuItem value="hour">Hodinová granularita</MenuItem>
          <MenuItem value="day">Denní granularita</MenuItem>
          <MenuItem value="week">Týdenní granularita</MenuItem>
          <MenuItem value="month">Měsíční granularita</MenuItem>
        </Select>
      </FormControl>
      <LineChart
        xAxis={[{ scaleType: 'utc', data: chartData.x }]}
        series={[
          {
            data: chartData.y.map((values) => values[0]),
            valueFormatter: (value, context) => {
              const lastValidValue = getLastValidValue(chartData.y.map((values) => values[0]));
              return value == null ? (lastValidValue != null ? lastValidValue.toString() : 'NaN') : value.toString();
            },
          },
          {
            data: chartData.y.map((values) => values[1]),
            valueFormatter: (value, context) => {
              const lastValidValue = getLastValidValue(chartData.y.map((values) => values[1]));
              return value == null ? (lastValidValue != null ? lastValidValue.toString() : 'NaN') : value.toString();
            },
          },
        ]}
        height={300}
        // width={600}
        margin={{ top: 10, bottom: 20 }}
      />
    </>
  );
}
