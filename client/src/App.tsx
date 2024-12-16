import React from 'react';
import Header from './components/Header';
import MyLineChart from './components/LineChart';
import ArcDesign from './components/Gauge';
// import './index.css';

function App() {
  return (
    <>
      <Header />
      <blockquote className="text-2xl font-semibold italic text-center text-slate-900">
        Moderní zemědělství
        <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-green-500 relative inline-block ml-2 mr-2">
          <span className="relative text-white ">začíná</span>
        </span>
        kde data přicházejí
      </blockquote>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '0 50px 0 50px', gap: '20px' }}>
        <MyLineChart selectedParameter="temperature" label={'Teplota'} unit={'°C'} color={'#76b7b2'} />
        <MyLineChart selectedParameter="humidity" label={'Vlhkost'} unit={'%'} />
        <MyLineChart selectedParameter="co2" label={'CO2'} unit={'ppm'} color={'#f28e2c'} />

        <MyLineChart selectedParameter="current_leaf_VPD" label={'VPD (list)'} unit={'(kPa)'} color={'green'} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <ArcDesign value={1000} min={400} max={1600} opt={1000} name="CO2" />
        <ArcDesign value={1000} min={400} max={1600} opt={1000} name="EC" />
        <ArcDesign value={6.6} min={0} max={14} opt={6.5} name="pH" />
        <ArcDesign value={8} min={0} max={20} opt={8} name="Dissolved Oxygen" />
        <ArcDesign value={65} min={0} max={100} opt={50} name="Humidity" />
        <ArcDesign value={22} min={0} max={50} opt={22} name="Temperature (°C)" />
        <ArcDesign value={18} min={0} max={40} opt={18} name="Water Temperature (°C)" />
        <ArcDesign value={18} min={0} max={40} opt={18} name="Water Temperature (°C)" />
      </div>
    </>
  );
}

export default App;
