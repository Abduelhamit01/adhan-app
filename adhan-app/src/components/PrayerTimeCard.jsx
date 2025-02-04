

function PrayerTimeCard() {
     const prayers = [
          { name: 'Fajr', time: '5:00 AM' },
          { name: 'Dhuhr', time: '1:00 PM' },
          { name: 'Asr', time: '4:00 PM' },
          { name: 'Maghrib', time: '7:00 PM' },
          { name: 'Isha', time: '9:00 PM' }
     ];

     return (
          <div className="flex justify-between gap-4 p-4">
               {prayers.map(prayer => (
                    <div
                         key={prayer.name}
                         className="p-4 bg-green-500 rounded shadow hover:bg-green-600 transition-colors duration-300"
                    >
                         <div className="font-bold">{prayer.name}</div>
                         {prayer.name} - {prayer.time}
                    </div>
               ))}
          </div>
     );
}

export default PrayerTimeCard;