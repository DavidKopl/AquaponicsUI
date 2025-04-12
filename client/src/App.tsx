import Header from './components/Header';
import { Quote } from './components/Quote';
import CalibrationControls from './components/CalibrationControls';
import Graphs from './components/Graphs';

function App() {
  return (
    <>
      <Header />
      <Quote />
      <CalibrationControls onStart={() => console.log('Calibration completed')} />
      <Graphs />
    </>
  );
}

export default App;
