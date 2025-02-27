// games/Asteroids.jsx
import { useEffect, useRef, useState } from 'react';

const KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
};

const FPS = 240;

const Asteroids = ({ onBack }) => {
  const canvasRef = useRef(null);
  const keys = useRef({});
  const bullets = useRef([]);
  const asteroids = useRef([]);
  const scoreRef = useRef(0);
  const ship = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    rotation: 0,
    velocity: { x: 0, y: 0 },
    canShoot: true,
    alive: true,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let lastTime = performance.now();
    const frameDuration = 1000 / FPS;

    const spawnAsteroids = (count) => {
      while (asteroids.current.length < count) {
        let x, y;
        do {
          x = Math.random() * canvas.width;
          y = Math.random() * canvas.height;
        } while (Math.abs(x - ship.current.x) < 150 && Math.abs(y - ship.current.y) < 150);

        asteroids.current.push({
          x,
          y,
          size: Math.random() * 40 + 50,
          velocity: {
            x: (Math.random() * 1.2 - 0.6),
            y: (Math.random() * 1.2 - 0.6),
          },
        });
      }
    };

    const updateShip = (delta) => {
      if (!ship.current.alive) return;

      const turnSpeed = 1.3 * delta;
      const acceleration = 0.05 * delta;

      if (keys.current['left']) ship.current.rotation -= turnSpeed;
      if (keys.current['right']) ship.current.rotation += turnSpeed;

      if (keys.current['up']) {
        const rad = ((ship.current.rotation - 90) * Math.PI) / 180;
        ship.current.velocity.x += acceleration * Math.cos(rad);
        ship.current.velocity.y += acceleration * Math.sin(rad);
      }

      ship.current.x = (ship.current.x + ship.current.velocity.x + canvas.width) % canvas.width;
      ship.current.y = (ship.current.y + ship.current.velocity.y + canvas.height) % canvas.height;

      ship.current.velocity.x *= 0.995;
      ship.current.velocity.y *= 0.995;
    };

    const drawShip = () => {
      if (!ship.current.alive) return;

      const { x, y, rotation } = ship.current;
      context.save();
      context.translate(x, y);
      context.rotate(((rotation - 90) * Math.PI) / 180);
      context.strokeStyle = 'white';
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(24, 0);
      context.lineTo(-20, 16);
      context.lineTo(-15, 0);
      context.lineTo(-20, -16);
      context.closePath();
      context.stroke();
      context.restore();
    };

    const shootBullet = () => {
      if (ship.current.canShoot && ship.current.alive) {
        const rad = ((ship.current.rotation - 90) * Math.PI) / 180;
        bullets.current.push({
          x: ship.current.x + Math.cos(rad) * 15,
          y: ship.current.y + Math.sin(rad) * 15,
          velocity: { x: Math.cos(rad) * 5, y: Math.sin(rad) * 5 },
          life: 150,
          radius: 6,
        });
        ship.current.canShoot = false;
        setTimeout(() => (ship.current.canShoot = true), 250);
      }
    };

    const updateBullets = (delta) => {
      bullets.current = bullets.current.filter((bullet) => bullet.life > 0);
      bullets.current.forEach((bullet) => {
        bullet.x = (bullet.x + bullet.velocity.x * delta + canvas.width) % canvas.width;
        bullet.y = (bullet.y + bullet.velocity.y * delta + canvas.height) % canvas.height;
        bullet.life -= 1 * delta;
      });
    };

    const updateAsteroids = (delta) => {
      asteroids.current.forEach((asteroid) => {
        asteroid.x = (asteroid.x + asteroid.velocity.x * delta + canvas.width) % canvas.width;
        asteroid.y = (asteroid.y + asteroid.velocity.y * delta + canvas.height) % canvas.height;
      });

      if (asteroids.current.length === 0) spawn(12);
    };

    const checkCollisions = () => {
      if (ship.current.alive) {
        asteroids.current.forEach((asteroid) => {
          const dx = ship.current.x - asteroid.x;
          const dy = ship.current.y - asteroid.y;
          if (Math.sqrt(dx * dx + dy * dy) < asteroid.size / 2 + 10) {
            ship.current.alive = false;
            setTimeout(() => {
              ship.current = {
                x: canvas.width / 2,
                y: canvas.height / 2,
                rotation: 0,
                velocity: { x: 0, y: 0 },
                canShoot: true,
                alive: true,
              };
              scoreRef.current = 0;
              spawnAsteroids(10);
            }, 1500);
          }
        });
      }

      bullets.current = bullets.current.filter((bullet) => {
        let hit = false;
        asteroids.current = asteroids.current.filter((asteroid) => {
          const dx = bullet.x - asteroid.x;
          const dy = bullet.y - asteroid.y;
          if (Math.sqrt(dx * dx + dy * dy) < asteroid.size / 2) {
            scoreRef.current += 100;
            hit = true;
            return false;
          }
          return true;
        });
        return !hit;
      });
    };

    const render = (timestamp) => {
      const delta = (timestamp - lastTime) / (1000 / FPS);
      lastTime = timestamp;

      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = 'white';
      context.font = '20px Arial';
      context.fillText(`Score: ${scoreRef.current}`, 20, 40);

      updateShip(delta);
      drawShip();
      updateBullets(delta);
      updateAsteroids(delta);
      checkCollisions();

      bullets.current.forEach((bullet) => {
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
        context.fill();
      });

      asteroids.current.forEach((asteroid) => {
        context.strokeStyle = 'gray';
        context.lineWidth = 2;
        context.beginPath();
        context.arc(asteroid.x, asteroid.y, asteroid.size / 2, 0, Math.PI * 2);
        context.stroke();
      });

      requestAnimationFrame(render);
    };

    spawnAsteroids(10);
    requestAnimationFrame(render);

    const handleKeyDown = (e) => {
      if (KEY_CODES[e.keyCode]) keys.current[KEY_CODES[e.keyCode]] = true;
      if (e.keyCode === 32) shootBullet();
      if (e.key === 'Escape') onBack();
    };

    const handleKeyUp = (e) => {
      if (KEY_CODES[e.keyCode]) keys.current[KEY_CODES[e.keyCode]] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [onBack]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
      <button
        onClick={onBack}
        className="absolute top-4 right-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
        Back to Menu (ESC)
      </button>
    </div>
  );
};

export default Asteroids;
