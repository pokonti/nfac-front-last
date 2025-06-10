import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import usePlayerMovement from '../hooks/usePlayerMovement';
import useRealtimePlayers from '../hooks/useRealtimePlayers';
import { writePlayer, removePlayer } from '../services/firebase';

const WIDTH = 800;
const HEIGHT = 600;
const SIZE = 10;

const PLAYER_COLORS = [
  '#FF6B6B', 
  '#4ECDC4', 
  '#45B7D1', 
  '#96CEB4', 
  '#FFEEAD', 
  '#D4A5A5', 
  '#9B59B6', 
  '#3498DB', 
  '#E67E22', 
  '#2ECC71', 
];

const getRandomColor = () => {
  return PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
};

export default function GameField({ nickname }) {
  const canvasRef = useRef(null);
  const [playerId] = useState(uuidv4());
  const [player, setPlayer] = useState({
    id: playerId,
    x: WIDTH / 2,
    y: HEIGHT / 2,
    color: getRandomColor(),
    name: nickname
  });

  useEffect(() => {
    writePlayer(player);
    window.addEventListener('beforeunload', () => removePlayer(player.id));
    return () => removePlayer(player.id);
  }, [player]);

  const players = useRealtimePlayers();
  usePlayerMovement(player, setPlayer);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const draw = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      Object.values(players).forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, SIZE, SIZE);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        ctx.fillRect(p.x, p.y, SIZE, SIZE);
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(p.name, p.x + SIZE/2, p.y - 5);
      });
    };
    draw();
  }, [players]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={WIDTH} 
          height={HEIGHT} 
          className="rounded-lg shadow-2xl border-4 border-indigo-500/50 bg-gray-800"
        />
        <div className="absolute top-4 left-4 text-white text-sm font-mono bg-gray-800/80 px-2 py-1 rounded">
          Players: {Object.keys(players).length}
        </div>
      </div>
    </div>
  );
}