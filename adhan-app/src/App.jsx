import './App.css'
import Clock from './components/Clock.jsx'
import PrayerTimeCard from './components/PrayerTimeCard.jsx';
import Background from './components/Background.jsx';



function App() {
  return (
    <div>
      <h1 className='text-6xl flex justify-center p-5 text-center text-white'>Adhan App</h1>
      <Background />
      <div className="min-h-screen flex flex-col justify-center">
        <Clock />
        <div className='container mx-auto px-4'>
          <PrayerTimeCard />
        </div>
      </div>
    </div>
  );
}

export default App;
