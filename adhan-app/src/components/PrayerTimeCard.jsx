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
          <div className="flex justify-between gap-3 p-4">
               {prayers.map(prayer => (
                    <div
                         key={prayer.name}
                         className="p-9 bg-green-500 rounded-2xl shadow hover:bg-green-600 transition-colors duration-300"
                    >
                         <div className="text-2xl font-bold round">{prayer.name}</div>
                         <div className='text-2xl'>{prayer.time}</div>
                    </div>
               ))}
          </div>
     );
}

export default PrayerTimeCard;