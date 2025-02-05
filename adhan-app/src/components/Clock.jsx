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
          <div>
               <div className=" bg-white/10 backdrop-blur-lg rounded-xl px-8 py-4 
     text-white text-3xl font-bold mx-auto w-fit
     border border-white/20 shadow-lg">
                    {time}
               </div>
          </div>

     );
}

export default Clock;