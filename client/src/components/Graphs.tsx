import { useState, useEffect } from 'react';
import MyLineChart from './LineChart';
import ArcDesign from './Gauge';
import axios from 'axios';

function Graphs() {
  const [latestData, setLatestData] = useState<null | any>(null);
  const [error, setError] = useState<string | null>(null);

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

  const { temperature, humidity, co2, vpd, ph, ec } = latestData;

  return (
    <>
      <div className="md:grid grid-cols-2 gap-5 mr-12 ml-12">
        <MyLineChart selectedParameter="temperature" label={'Teplota'} unit={'°C'} color={'#76b7b2'} />
        <MyLineChart selectedParameter="humidity" label={'Vlhkost'} unit={'%'} />
        <MyLineChart selectedParameter="co2" label={'CO2'} unit={'ppm'} color={'#f28e2c'} />
        <MyLineChart selectedParameter="current_leaf_VPD" label={'VPD (list)'} unit={'(kPa)'} color={'green'} />
        <MyLineChart selectedParameter="do" label={'DO'} unit={'ppm'} color={'blue'} />
        <div className="flex justify-center items-center">
          <div className="text-center">
            <p className="mb-4 text-4xl text-gray-500 dark:text-gray-800">Aktuální EC: {ec != null && ec > 0.3 ? ec.toFixed(2) : 'Senzor není připojen'}</p>
            <p className="mb-4 text-4xl text-gray-500 dark:text-gray-800">Aktuální pH: {ph != null && ph >= 3 && ph <= 8 ? ph.toFixed(2) : 'Senzor není připojen'}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <ArcDesign value={temperature} min={0} max={50} opt={22} name="Temperature (°C)" />
        <ArcDesign value={humidity} min={0} max={100} opt={50} name="Humidity" />
        <ArcDesign value={co2} min={400} max={1600} opt={1000} name="CO2" />
        {/* <ArcDesign value={dissolvedOxygen} min={0} max={20} opt={8} name="Dissolved Oxygen" /> //TODO: Zobrazovat jako graf*/}
        <ArcDesign value={vpd['current_leaf_VPD']} min={0.8} max={1.7} opt={1.2} name="VPD" />
        {/* <ArcDesign value={ec} min={0} max={5} opt={2} name="EC" />
        <ArcDesign value={ph} min={0} max={14} opt={6.5} name="pH" /> */}
      </div>
    </>
  );
}

export default Graphs;
