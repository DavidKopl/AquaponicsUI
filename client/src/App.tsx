import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MyLineChart from './components/LineChart';
import ArcDesign from './components/Gauge';
import axios from 'axios';

function App() {
  const [latestData, setLatestData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [calibrationCountdown, setCalibrationCountdown] = useState<number | null>(null);
  const [activeCalibration, setActiveCalibration] = useState<string | null>(null); // Stav pro sledování aktivního tlačítka
  const startCountdown = (type: string) => {
    setActiveCalibration(type); // Nastavíme aktivní kalibraci
    setCountdown(5);
    setCalibrationCountdown(null);

    let currentCountdown = 5;

    const readyTimer = setInterval(() => {
      currentCountdown -= 1;
      setCountdown(currentCountdown);

      if (currentCountdown <= 0) {
        clearInterval(readyTimer);
        setCountdown(null); // Reset na null po dosažení nuly
        startCalibrationTimer();
      }
    }, 1000);
  };

  const startCalibrationTimer = () => {
    let currentCalibration = 30;
    setCalibrationCountdown(currentCalibration);

    const calibrationTimer = setInterval(() => {
      currentCalibration -= 1;
      setCalibrationCountdown(currentCalibration);

      if (currentCalibration <= 0) {
        clearInterval(calibrationTimer);
        setCalibrationCountdown(null); // Reset na null po dokončení kalibrace
        setActiveCalibration(null); // Reset aktivní kalibrace
        handleCalibrationChange('ph', false);
        handleCalibrationChange('ec', false);
        handleCalibrationChange('do', false);
      }
    }, 1000);
  };

  const handleCalibrationChange = async (type: string, isActive: boolean) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/update-calibration`, {
        ecCalibration: type === 'ec' ? isActive : undefined,
        phCalibration: type === 'ph' ? isActive : undefined,
        doCalibration: type === 'do' ? isActive : undefined,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error updating calibration:', error);
    }
  };

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/data/latest-data`);
        if (response.data) {
          setLatestData(response.data);
        } else {
          setError('No data available');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
      }
    };
    fetchLatestData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!latestData) {
    return <div>Loading...</div>;
  }

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
      <div className="flex gap-1 md:gap-5 m-5 justify-center">
        <button
          type="button"
          onClick={() => {
            startCountdown('ph');
            handleCalibrationChange('ph', true);
          }}
          disabled={activeCalibration !== null}
          className={`inline-block rounded border-2 border-blue-500 px-6 pb-1.5 pt-2 text-xs font-medium uppercase leading-normal transition duration-200 ease-in-out ${activeCalibration ? 'bg-gray-300 text-gray-500' : 'bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white'}`}
        >
          pH calibration
        </button>
        <button
          type="button"
          onClick={() => {
            startCountdown('ec');
            handleCalibrationChange('ec', true);
          }}
          disabled={activeCalibration !== null}
          className={`inline-block rounded border-2 border-green-500 px-6 pb-1.5 pt-2 text-xs font-medium uppercase leading-normal transition duration-200 ease-in-out ${activeCalibration ? 'bg-gray-300 text-gray-500' : 'bg-green-100 text-green-500 hover:bg-green-500 hover:text-white'}`}
        >
          EC calibration
        </button>
        <button
          type="button"
          onClick={() => {
            startCountdown('do');
            handleCalibrationChange('do', true);
          }}
          disabled={activeCalibration !== null}
          className={`inline-block rounded border-2 border-purple-500 px-6 pb-1.5 pt-2 text-xs font-medium uppercase leading-normal transition duration-200 ease-in-out ${activeCalibration ? 'bg-gray-300 text-gray-500' : 'bg-purple-100 text-purple-500 hover:bg-purple-500 hover:text-white'}`}
        >
          DO calibration
        </button>
      </div>

      {countdown !== null && <p className="text-lg font-medium text-blue-600 flex justify-center">Ready in {countdown}...</p>}
      {calibrationCountdown !== null && <p className="text-lg font-medium text-green-600 flex justify-center">Calibration in process: {calibrationCountdown}...</p>}
      <div className="md:grid grid-cols-2 gap-5 mr-12 ml-12">
        <MyLineChart selectedParameter="temperature" label={'Teplota'} unit={'°C'} color={'#76b7b2'} />
        <MyLineChart selectedParameter="humidity" label={'Vlhkost'} unit={'%'} />
        <MyLineChart selectedParameter="co2" label={'CO2'} unit={'ppm'} color={'#f28e2c'} />
        <MyLineChart selectedParameter="current_leaf_VPD" label={'VPD (list)'} unit={'(kPa)'} color={'green'} />
        <div>
          <p>Poslední naměřená hodnota EC: {ec != null ? ec.toFixed(2) : 'N/A'}</p>
          <p>Poslední naměřená hodnota pH: {ph != null ? ph.toFixed(2) : 'N/A'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <ArcDesign value={temperature} min={0} max={50} opt={22} name="Temperature (°C)" />
        <ArcDesign value={humidity} min={0} max={100} opt={50} name="Humidity" />
        <ArcDesign value={co2} min={400} max={1600} opt={1000} name="CO2" />
        {/* <ArcDesign value={dissolvedOxygen} min={0} max={20} opt={8} name="Dissolved Oxygen" /> //TODO: Zobrazovat jako graf*/}
        <ArcDesign value={vpd['current_leaf_VPD']} min={0.8} max={1.7} opt={1.2} name="VPD" />
        <ArcDesign value={ec} min={0} max={5} opt={2} name="EC" />
        <ArcDesign value={ph} min={0} max={14} opt={6.5} name="pH" />
      </div>
    </>
  );
}

export default App;
