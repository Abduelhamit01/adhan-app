import { useState, useEffect } from "react";

function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center p-6">
      <div className="bg-blue-400 rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
        <div className="text-6xl font-light text-gray-800 tracking-wider">
          {time}
        </div>
      </div>
    </div>
  );
}

export default Clock;