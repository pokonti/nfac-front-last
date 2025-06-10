import { useEffect, useState } from 'react';
import { onPlayersUpdate } from '../services/firebase';

export default function useRealtimePlayers() {
  const [players, setPlayers] = useState({});

  useEffect(() => {
    const unsubscribe = onPlayersUpdate(setPlayers);
    return () => unsubscribe();
  }, []);

  return players;
}
