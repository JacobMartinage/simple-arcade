// GalagaGame.jsx
import { useEffect, useRef, useState } from 'react';
import '../index.css';

export default function Galaga({ onBack }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState({ running: true, score: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const player = {
      width: 40,
      height: 20,
      x: canvas.width / 2 - 20,
      y: canvas.height - 40,
      speed: 5,
    };

    const bullets = [];
    const enemies = [];

    for (let i = 0; i < 6; i++) {
      enemies.push({
        x: i * 60 + 40,
        y: 50,
        width: 40,
        height: 20,
        speed: 2,
        direction: 1,
      });
    }

    const drawPlayer = () => {
      ctx.fillStyle = '#00d1b2';
      ctx.fillRect(player.x, player.y, player.width, player.height);
    };

    const drawEnemies = () => {
      ctx.fillStyle = '#ff3860';
      enemies.forEach((enemy) => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });
    };

    const drawBullets = () => {
      ctx.fillStyle = '#ffdd57';
      bullets.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, 4, 10);
      });
    };

    const moveEnemies = () => {
      enemies.forEach((enemy) => {
        enemy.x += enemy.speed * enemy.direction;
        if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
          enemy.direction *= -1;
          enemy.y += 20;
        }
      });
    };

    const moveBullets = () => {
      bullets.forEach((bullet, index) => {
        bullet.y -= 6;
        if (bullet.y < 0) bullets.splice(index, 1);
      });
    };

    const detectCollisions = () => {
      bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + 4 > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + 10 > enemy.y
          ) {
            enemies.splice(enemyIndex, 1);
            bullets.splice(bulletIndex, 1);
            setGameState((prev) => ({ ...prev, score: prev.score + 50 }));
          }
        });
      });
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
      if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed;
      if (e.key === ' ' || e.key === 'Spacebar') {
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawPlayer();
      drawEnemies();
      drawBullets();

      moveEnemies();
      moveBullets();
      detectCollisions();

      if (gameState.running) requestAnimationFrame(draw);
    };

    document.addEventListener('keydown', handleKeyDown);
    draw();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameState.running]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h2 className="text-2xl mb-4">🚀 Galaga Clone</h2>
      <p className="mb-2">Score: {gameState.score}</p>
      <canvas ref={canvasRef} width="480" height="320" className="border-2 border-white rounded-lg" />
      <button
        onClick={onBack}
        className="mt-4 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
      >
        🔙 Back to Menu
      </button>
    </div>
  );
}