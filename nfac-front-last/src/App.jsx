import React, { useState } from 'react';
import './App.css'
import StartPage from './components/StartPage';
import GameField from './components/GameField'

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [nickname, setNickname] = useState('');

  const handleStartGame = (playerNickname) => {
    setNickname(playerNickname);
    setGameStarted(true);
  };

  return (
    <div>
      {!gameStarted ? (
        <StartPage onStart={handleStartGame} />
      ) : (
        <GameField nickname={nickname} />
      )}
    </div>
  )
}
