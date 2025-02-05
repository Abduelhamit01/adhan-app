import { PrayerTimes, Coordinates, CalculationMethod } from 'adhan';  // CalculationMethod hinzugefügt

function PrayerTimeCard() {
     const coordinates = new Coordinates(50.9375, 6.9603);
     const date = new Date();

     // Berechnungsmethode hinzufügen
     const params = CalculationMethod.MoonsightingCommittee();
     const prayerTimes = new PrayerTimes(coordinates, date, params);

     console.log("Prayer Times: ", prayerTimes);

     // Jetzt können wir die echten Zeiten verwenden
     const prayers = [
          { name: 'Fajr', time: prayerTimes.fajr.toLocaleTimeString() },
          { name: 'Dhuhr', time: prayerTimes.dhuhr.toLocaleTimeString() },
          { name: 'Asr', time: prayerTimes.asr.toLocaleTimeString() },
          { name: 'Maghrib', time: prayerTimes.maghrib.toLocaleTimeString() },
          { name: 'Isha', time: prayerTimes.isha.toLocaleTimeString() }
     ];

     return (
          <div className="flex justify-center gap-4 p-4">
               {prayers.map(prayer => (
                    <div
                         key={prayer.name}
                         className="p-4 bg-white/10 backdrop-blur-lg rounded-xl 
                     hover:transform hover:-translate-y-1 transition-all duration-300
                     border border-white/20 text-white shadow-lg"
                    >
                         <div className="text-lg font-bold">{prayer.name}</div>
                         <div className="text-base opacity-90">{prayer.time}</div>
                    </div>
               ))}
          </div>
     );
}

export default PrayerTimeCard;