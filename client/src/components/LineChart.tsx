import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material'; // Import správného typu pro SelectChangeEvent
import { format } from 'date-fns';

interface MyLineChartProps {
  label?: string | null;
  unit?: string;
  selectedParameter: 'temperature' | 'humidity' | 'co2' | 'ec' | 'ph';
}

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

export default function MyLineChart({ selectedParameter, label, unit }: MyLineChartProps) {
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
  const fetchData = async (granularity: string) => {
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

  // Funkce pro formátování data podle granularita
  const formatDateByGranularity = (element: number) => {
    const date = new Date(element);
    switch (granularity) {
      case 'minute':
        return format(date, 'yyyy-MM-dd HH:mm'); // Formát pro minutovou granularitu
      case 'hour':
        return format(date, 'yyyy-MM-dd HH:00'); // Formát pro hodinovou granularitu
      case 'day':
        return format(date, 'yyyy-MM-dd'); // Formát pro denní granularitu
      case 'week':
        // Pro týdenní granularitu se můžeme rozhodnout jak formátovat, třeba číslo týdne v roce
        return format(date, "yyyy-'W'ww"); // Například '2024-W12' pro 12. týden v roce
      case 'month':
        return format(date, 'yyyy-MM'); // Formát pro měsíční granularitu
      case 'quarter':
        // Pro čtvrtletí, použijme měsíc a vypočítáme čtvrtletí (Q1, Q2, Q3, Q4)
        const quarter = Math.floor((date.getMonth() + 3) / 3); // Spočítáme číslo čtvrtletí
        return format(date, `yyyy-'Q'${quarter}`); // Například '2024-Q1'
      default:
        return format(date, 'yyyy-MM-dd HH:mm'); // Výchozí formát pro jinou granularitu
    }
  };
  // Získání indexu pro vybraný parametr
  const getParameterIndex = () => {
    switch (selectedParameter) {
      case 'temperature':
        return 0;
      case 'humidity':
        return 1;
      case 'co2':
        return 2;
      case 'ec':
        return 3;
      case 'ph':
        return 4;
      default:
        return 0;
    }
  };

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
          <MenuItem value="quarter">Čtvrtletní granularita</MenuItem>
        </Select>
      </FormControl>

      <LineChart
        xAxis={[
          {
            scaleType: 'utc',
            data: chartData.x,
            valueFormatter: (element) => formatDateByGranularity(element), // Použití formátovací funkce podle granularita
          },
        ]}
        series={[
          {
            label: label ? `${label} ${unit}` : '',
            data: chartData.y.map((values) => values[getParameterIndex()]),
            valueFormatter: (value, context) => {
              const lastValidValue = getLastValidValue(chartData.y.map((values) => values[getParameterIndex()]));
              return value == null ? (lastValidValue != null ? lastValidValue.toString() : 'NaN') : value.toString();
            },
          },
        ]}
        height={300}
        margin={{ top: 10, bottom: 20 }}
      />
    </>
  );
}
