// App.jsx
import { useState, useEffect } from 'react';
import GalagaGame from './games/Galaga';
import Asteroids from './games/Asteroids';
import './index.css';

function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const games = [
    // { name: 'GALAGA', component: <GalagaGame onBack={() => setSelectedGame(null)} /> },
    { name: 'ASTEROIDS', component: <Asteroids onBack={() => setSelectedGame(null)} /> },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedGame === null) {
        if (e.key === 'ArrowUp') {
          setSelectedIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
        } else if (e.key === 'ArrowDown') {
          setSelectedIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
        } else if (e.key === 'Enter' || e.key === ' ') {
          setSelectedGame(games[selectedIndex].name.toLowerCase());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, games, selectedGame]);

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-green-400 font-mono w-screen text-[6rem]">
      <h1 className="mb-10 text-[6rem]">ARCADE</h1>
      <div className="space-y-4 text-[6rem]">
        {games.map((game, index) => (
          <div key={game.name} className={index === selectedIndex ? 'text-green-200' : 'text-green-600'}>
            {index === selectedIndex ? '> ' : ''}{game.name}{index === selectedIndex ? ' <' : ''}
          </div>
        ))}
      </div>
      <p className="mt-8 text-green-700 text-[2rem]">PRESS ENTER TO PLAY</p>
    </div>
  );

  const renderContent = () => {
    switch (selectedGame) {
      
      case 'asteroids':
        return <Asteroids onBack={() => setSelectedGame(null)} />;
      case 'galaga':
        return <GalagaGame onBack={() => setSelectedGame(null)} />;
      default:
        return renderMenu();
    }
  };

  return <div className="w-full h-full">{renderContent()}</div>;
}

export default App; 