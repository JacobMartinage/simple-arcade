// AsteroidsGame.jsx
import { useEffect, useRef, useState } from 'react';

export default function AsteroidsGame({ onBack }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const ship = { x: canvas.width / 2, y: canvas.height / 2, angle: 0, speed: 0, rotation: 0 };
    const bullets = [];
    const asteroids = [];

    const spawnAsteroids = () => {
      asteroids.length = 0;
      for (let i = 0; i < 5; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        asteroids.push({
          x: x,
          y: y,
          radius: 30 + Math.random() * 20,
          dx: (Math.random() - 0.5) * 2,
          dy: (Math.random() - 0.5) * 2,
        });

      }
      console.log("Asteroids spawned:", asteroids);
    };

    const drawStartScreen = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.fillText('Press Enter to Start', canvas.width / 2 - 100, canvas.height / 2 - 20);
    };

    const drawEndScreen = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2 - 20);
      ctx.fillText(`Score: ${score}`, canvas.width / 2 - 70, canvas.height / 2 + 20);
      ctx.fillText('Press R to Restart', canvas.width / 2 - 100, canvas.height / 2 + 60);
    };

    const drawShip = () => {
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);
      ctx.strokeStyle = '#00ff00';
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(-10, -7);
      ctx.lineTo(-10, 7);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    const drawAsteroids = () => {
      ctx.strokeStyle = '#ff6347';
      asteroids.forEach((asteroid) => {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
        ctx.stroke();
      });
    };

    const drawBullets = () => {
      ctx.fillStyle = '#ffff00';
      bullets.forEach((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const moveShip = () => {
      ship.x += ship.speed * Math.cos(ship.angle);
      ship.y += ship.speed * Math.sin(ship.angle);
      ship.x = (ship.x + canvas.width) % canvas.width;
      ship.y = (ship.y + canvas.height) % canvas.height;
    };

    const moveAsteroids = () => {
      asteroids.forEach((asteroid) => {
        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;

        if (asteroid.x < 0) asteroid.x = canvas.width;
        if (asteroid.x > canvas.width) asteroid.x = 0;
        if (asteroid.y < 0) asteroid.y = canvas.height;
        if (asteroid.y > canvas.height) asteroid.y = 0;
      });
    };

    const moveBullets = () => {
      bullets.forEach((bullet, i) => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
          bullets.splice(i, 1);
        }
      });
    };

    const detectCollisions = () => {
      asteroids.forEach((asteroid, aIndex) => {
        const dist = Math.hypot(ship.x - asteroid.x, ship.y - asteroid.y);
        if (dist < asteroid.radius) {
          setGameState('end');
        }
      });

      bullets.forEach((bullet, bIndex) => {
        asteroids.forEach((asteroid, aIndex) => {
          const dist = Math.hypot(bullet.x - asteroid.x, bullet.y - asteroid.y);
          if (dist < asteroid.radius) {
            if (asteroid.radius > 15) {
              asteroids.push({
                x: asteroid.x,
                y: asteroid.y,
                radius: asteroid.radius / 2,
                dx: asteroid.dx,
                dy: asteroid.dy,
              });
            }
            asteroids.splice(aIndex, 1);
            bullets.splice(bIndex, 1);
            setScore((prev) => prev + 100);
          }
        });
      });
    };

    const handleKeyDown = (e) => {
      if (gameState === 'start' && (e.key === 'Enter' || e.key === ' ')) {
        setGameState('running');
        spawnAsteroids();
      } else if (gameState === 'end') {
        if (e.key === 'r') {
          setGameState('running');
          setScore(0);
          bullets.length = 0;
          asteroids.length = 0;
          spawnAsteroids();
        }
      } else if (gameState === 'running') {
        if (e.key === 'ArrowLeft') ship.rotation = -0.08;
        if (e.key === 'ArrowRight') ship.rotation = 0.08;
        if (e.key === 'ArrowUp') ship.speed = 2;
        if (e.key === ' ') {
          bullets.push({
            x: ship.x + Math.cos(ship.angle) * 12,
            y: ship.y + Math.sin(ship.angle) * 12,
            dx: Math.cos(ship.angle) * 5,
            dy: Math.sin(ship.angle) * 5,
          });
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') ship.rotation = 0;
      if (e.key === 'ArrowUp') ship.speed = 0;
    };

    const update = () => {
      if (gameState === 'running') {
        ship.angle += ship.rotation;
        moveShip();
        moveAsteroids();
        moveBullets();
        detectCollisions();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameState === 'start') {
        drawStartScreen();
      } else if (gameState === 'running') {
        drawShip();
        drawAsteroids();
        drawBullets();
      } else if (gameState === 'end') {
        drawEndScreen();
      }
    };

    const gameLoop = () => {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  return (
    <div className="w-screen flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h2 className="text-2xl mb-4">🌌 Asteroids</h2>
      <p className="mb-2">Score: {score}</p>
      <canvas ref={canvasRef} width="500" height="400" className="border-2 border-white rounded-lg" />
      <button
        onClick={onBack}
        className="mt-4 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
      >
        🔙 Back to Menu
      </button>
    </div>
  );
}

