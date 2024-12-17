import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MyLineChart from './components/LineChart';
import ArcDesign from './components/Gauge';
import axios from 'axios';

function App() {
  const [latestData, setLatestData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  // Načítání dat při načtení komponenty
  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/data/latest-data`);
        if (response.data) {
          setLatestData(response.data); // Uložíme data do stavu
        } else {
          setError('No data available'); // Pokud nejsou data, nastavíme chybu
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data'); // Nastavíme chybu při selhání požadavku
      }
    };

    fetchLatestData();
  }, []); // Prázdné pole znamená, že se funkce spustí pouze jednou při prvním renderu

  // Podmínky pro zobrazení chyb nebo načítání
  if (error) {
    return <div>{error}</div>;
  }

  if (!latestData) {
    return <div>Loading...</div>;
  }

  // Vytvoření proměnných pro hodnoty z posledního záznamu
  const { temperature, humidity, co2, vpd, ph, ec, do: dissolvedOxygen } = latestData;

  return (
    <>
      <Header />
      <blockquote className="text-2xl font-semibold italic text-center text-slate-900">
        Moderní zemědělství
        <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-green-500 relative inline-block ml-2 mr-2">
          <span className="relative text-white">začíná</span>
        </span>
        kde data přicházejí
      </blockquote>
      <div className="md:grid grid-cols-2 gap-5 mr-12 ml-12">
        <MyLineChart selectedParameter="temperature" label={'Teplota'} unit={'°C'} color={'#76b7b2'} />
        <MyLineChart selectedParameter="humidity" label={'Vlhkost'} unit={'%'} />
        <MyLineChart selectedParameter="co2" label={'CO2'} unit={'ppm'} color={'#f28e2c'} />
        <MyLineChart selectedParameter="current_leaf_VPD" label={'VPD (list)'} unit={'(kPa)'} color={'green'} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <ArcDesign value={temperature} min={0} max={50} opt={22} name="Temperature (°C)" />
        <ArcDesign value={humidity} min={0} max={100} opt={50} name="Humidity" />
        <ArcDesign value={co2} min={400} max={1600} opt={1000} name="CO2" />
        <ArcDesign value={vpd['current_leaf_VPD']} min={0.8} max={1.7} opt={1.2} name="VPD" />
        <ArcDesign value={ec} min={0} max={5} opt={2} name="EC" />
        <ArcDesign value={ph} min={0} max={14} opt={6.5} name="pH" />
        <ArcDesign value={dissolvedOxygen} min={0} max={20} opt={8} name="Dissolved Oxygen" />
      </div>
    </>
  );
}

export default App;
