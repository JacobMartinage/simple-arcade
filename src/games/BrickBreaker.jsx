// BrickBreakerGame.jsx
import { useEffect, useRef, useState } from 'react';
import '../index.css';

export default function BrickBreaker({ onBack }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState({ running: true, score: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const paddle = { width: 100, height: 10, x: canvas.width / 2 - 50, speed: 6 };
    const ball = { x: canvas.width / 2, y: canvas.height - 30, radius: 8, dx: 3, dy: -3 };

    const brickRowCount = 4;
    const brickColumnCount = 6;
    const brickWidth = 60;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const drawPaddle = () => {
      ctx.fillStyle = '#0095DD';
      ctx.fillRect(paddle.x, canvas.height - paddle.height - 10, paddle.width, paddle.height);
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ff4757';
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.fillStyle = '#ffa502';
            ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
          }
        }
      }
    };

    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (
            b.status === 1 &&
            ball.x > b.x &&
            ball.x < b.x + brickWidth &&
            ball.y > b.y &&
            ball.y < b.y + brickHeight
          ) {
            ball.dy = -ball.dy;
            b.status = 0;
            setGameState((prev) => ({ ...prev, score: prev.score + 10 }));
          }
        }
      }
    };

    const movePaddle = (e) => {
      if (e.key === 'ArrowRight' && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
      } else if (e.key === 'ArrowLeft' && paddle.x > 0) {
        paddle.x -= paddle.speed;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
      }

      if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      } else if (
        ball.y + ball.radius > canvas.height - paddle.height - 10 &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
      ) {
        ball.dy = -ball.dy;
      } else if (ball.y + ball.radius > canvas.height) {
        setGameState({ running: false, score: gameState.score });
      }

      if (gameState.running) {
        requestAnimationFrame(draw);
      }
    };

    document.addEventListener('keydown', movePaddle);
    draw();

    return () => {
      document.removeEventListener('keydown', movePaddle);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">🧱 Brick Breaker</h2>
      <p className="mb-2">Score: {gameState.score}</p>
      {!gameState.running && <p className="text-red-500">Game Over!</p>}
      <canvas ref={canvasRef} width="480" height="320" className="border-2 border-white rounded-lg" />
      <button
        onClick={onBack}
        className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        🔙 Back to Menu
      </button>
    </div>
  );
}
