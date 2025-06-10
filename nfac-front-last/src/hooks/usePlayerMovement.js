import { useEffect } from 'react';
import { updatePlayer } from '../services/firebase';

export default function usePlayerMovement(player, setPlayer) {
  useEffect(() => {
    const handleKey = e => {
      setPlayer(prev => {
        let { x, y } = prev;
        if (e.key === 'w') y = Math.max(0, y - 1);
        if (e.key === 's') y = Math.min(596, y + 1);
        if (e.key === 'a') x = Math.max(0, x - 1);
        if (e.key === 'd') x = Math.min(796, x + 1);
        const newPlayer = { ...prev, x, y };
        updatePlayer(newPlayer);
        return newPlayer;
      });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setPlayer]);
}
