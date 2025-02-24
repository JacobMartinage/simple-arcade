// App.jsx
import { useState } from 'react';
import BrickBreaker from './games/BrickBreaker';
import Galaga from './games/Galaga.jsx';
import './index.css';

function App() {
  const [selectedGame, setSelectedGame] = useState(null);

  const renderContent = () => {
    switch (selectedGame) {
      case 'brickbreaker':
        return <BrickBreaker onBack={() => setSelectedGame(null)} />;
      case 'galaga':
        return <Galaga onBack={() => setSelectedGame(null)} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <h1 className="text-4xl mb-8">🎮 Arcade Machine 🎮</h1>
            <div className="space-y-4">
              <button
                className="px-6 py-3 rounded-2xl bg-green-500 hover:bg-green-600 transition"
                onClick={() => setSelectedGame('galaga')}
              >
                🚀 Play Galaga Clone
              </button>
              <button
                className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 transition"
                onClick={() => setSelectedGame('brickbreaker')}
              >
                🧱 Play Brick Breaker
              </button>
            </div>
          </div>
        );
    }
  };

  return <div>{renderContent()}</div>;
}

export default App;
