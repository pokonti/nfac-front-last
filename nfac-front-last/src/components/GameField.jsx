import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import usePlayerMovement from '../hooks/usePlayerMovement';
import useRealtimePlayers from '../hooks/useRealtimePlayers';
import { writePlayer, removePlayer } from '../services/firebase';

const WIDTH = 800;
const HEIGHT = 600;
const SIZE = 10;

export default function GameField() {
  const canvasRef = useRef(null);
  const [playerId] = useState(uuidv4());
  const [player, setPlayer] = useState({
    id: playerId,
    x: WIDTH / 2,
    y: HEIGHT / 2,
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    name: 'Player'
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
      });
    };
    draw();
  }, [players]);

  return <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ backgroundColor: '#111' }} />;
}