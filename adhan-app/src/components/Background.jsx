import { useEffect } from 'react';
import '../background.css';
import mosque from '../assets/images/mosque.jpeg';

function Background() {
    useEffect(() => {
        // Referenz auf das div-Element mit der ID "stars-container"
        const container = document.querySelector('#stars-container');
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'w-[2px] h-[2px] bg-white absolute rounded-full animate-twinkle';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 60}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(star);
        }
    }, []);

    return (
        <div id="stars-container" className="fixed inset-0 bg-gradient-to-b from-[#1a1f3c] to-[#0f1528] -z-10 overflow-hidden">
            <img 
                src={mosque}
                alt="mosque"
                className="absolute bottom-0 left-0 w-full h-auto object-cover"
            />
        </div>
    );
}

export default Background;