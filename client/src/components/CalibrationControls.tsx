import React, { useState } from 'react';
import axios from 'axios';

interface CalibrationControlsProps {
  onStart: () => void;
}

const CalibrationControls: React.FC<CalibrationControlsProps> = ({ onStart }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [calibrationCountdown, setCalibrationCountdown] = useState<number | null>(null);
  const [activeCalibration, setActiveCalibration] = useState<string | null>(null);

  const startCountdown = (type: string) => {
    setActiveCalibration(type);
    setCountdown(5);
    setCalibrationCountdown(null);
    handleCalibrationChange(type, true);

    let currentCountdown = 5;
    const readyTimer = setInterval(() => {
      currentCountdown -= 1;
      setCountdown(currentCountdown);
      if (currentCountdown <= 0) {
        clearInterval(readyTimer);
        setCountdown(null);
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
        setCalibrationCountdown(null);
        setActiveCalibration(null);
        ['ph', 'ec', 'do'].forEach((type) => handleCalibrationChange(type, false));
        onStart(); // callback z parent komponenty
      }
    }, 1000);
  };

  const handleCalibrationChange = async (type: string, isActive: boolean) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/update-calibration`, {
        ecCalibration: type === 'ec' ? isActive : undefined,
        phCalibration: type === 'ph' ? isActive : undefined,
        doCalibration: type === 'do' ? isActive : undefined,
      });
    } catch (error) {
      console.error('Error updating calibration:', error);
    }
  };

  return (
    // <div className="flex gap-1 md:gap-5 m-5 justify-center">
    //   {['ph', 'ec', 'do'].map((type) => (
    //     <button key={type} type="button" onClick={() => startCountdown(type)} disabled={activeCalibration !== null} className={`inline-block rounded border-2 px-6 pb-1.5 pt-2 text-xs font-medium uppercase leading-normal transition duration-200 ease-in-out ${type === 'ph' ? 'border-blue-500 text-blue-500 bg-blue-100 hover:bg-blue-500 hover:text-white' : type === 'ec' ? 'border-green-500 text-green-500 bg-green-100 hover:bg-green-500 hover:text-white' : 'border-purple-500 text-purple-500 bg-purple-100 hover:bg-purple-500 hover:text-white'} ${activeCalibration ? 'bg-gray-300 text-gray-500' : ''}`}>
    //       {type.toUpperCase()} calibration
    //     </button>
    //   ))}

    //   {countdown !== null && <p className="text-lg font-medium text-blue-600 flex justify-center w-full">Ready in {countdown}...</p>}
    //   {calibrationCountdown !== null && <p className="text-lg font-medium text-green-600 flex justify-center w-full">Calibration in process: {calibrationCountdown}...</p>}
    // </div>
    <>
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
    </>
  );
};

export default CalibrationControls;
