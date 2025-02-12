import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [audio] = useState(new Audio('/sounds/background.mp3')); 
  const [isPlaying, setIsPlaying] = useState(false); 

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.3; 
  }, [audio]);

  const startMusic = () => {
    if (!isPlaying) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error("Error playing background music:", err));
    }
  };

  
  const playSound = (soundFile, volume = 1.0) => {
    const sound = new Audio(soundFile);
    sound.volume = volume;
    sound.play().catch(error => console.error("Error playing sound:", error));
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.error("Error resuming music:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board) || isDraw(board)) return;

    startMusic(); 

    playSound('/sounds/click.wav', 1.0);

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const winner = calculateWinner(newBoard);
    if (winner) {
      setTimeout(() => playSound('/sounds/win.wav', 0.3), 200);
    }
  };

  const winner = calculateWinner(board);
  const draw = isDraw(board);
  const status = winner
    ? `Pemenang: ${winner}`
    : draw
    ? "Permainan Seri!"
    : `Giliran berikutnya: ${isXNext ? 'X' : 'O'}`;

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>
      <div className="status">{status}</div>

      <button className="music-button" onClick={toggleMusic}>
        {isPlaying ? "Pause Music 🎵" : "Play Music ▶"}
      </button>

      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className="cell"
            data-value={cell}
            onClick={() => handleClick(index)}
          >
            {cell}
          </button>
        ))}
      </div>
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}

function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6], 
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isDraw(board) {
  return board.every(cell => cell !== null) && !calculateWinner(board);
}

export default App;
