import { useEffect, useState } from "react";
import "../stylos/Loading.css";

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const getRandomPetIcon = () => {
    const pets = ["🐕", "🐈"];
    return pets[Math.floor(Math.random() * pets.length)];
  };

  return (
    <div className="vet-loading-container">
      <div className="vet-shapes-container">
        {/* Huellas de patas animadas */}
        <div className="paw-print paw-1">🐾</div>
        <div className="paw-print paw-2">🐾</div>
        <div className="paw-print paw-3">🐾</div>

        {/* Elemento central con mascota */}
        <div className="vet-center-element">
          <div 
            className="vet-rotating-part part-1" 
            style={{ transform: `rotate(${progress * 3.6}deg)` }}
          ></div>
          <div 
            className="vet-rotating-part part-2" 
            style={{ transform: `rotate(${-progress * 3.6}deg)` }}
          ></div>
          <div className="vet-pet-icon">{getRandomPetIcon()}</div>
          <div className="vet-progress-text">{progress}%</div>
        </div>
      </div>

      {/* Barra de progreso con temática veterinaria */}
      <div className="vet-progress-container">
        <div 
          className="vet-progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
        <div className="vet-progress-symbols">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i}>💙</span> 
          ))};
        </div>
      </div>

      
    </div>
  );
};

export default Loading;