import './App.css'
import Clock from './components/Clock.jsx'
import PrayerTimeCard from './components/PrayerTimeCard.jsx';


function App() {
  return (
    <div>
      <h1 className='text-6xl'>Adhan App</h1>
      <Clock />
      <PrayerTimeCard/>
    </div>
  );
}

export default App;
