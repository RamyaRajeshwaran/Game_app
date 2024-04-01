import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [rounds, setRounds] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [player1Choice, setPlayer1Choice] = useState('');
  const [player2Choice, setPlayer2Choice] = useState('');
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameId, setGameId] = useState(null);

  const startGame = async () => {
    if (player1.trim() === '' || player2.trim() === '') {
      alert('Please enter names for both players.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/games', { player1, player2 });
      const { data } = response;
      setGameId(data._id);
      setGameStarted(true);
      setCurrentRound(1);
      setRounds([]);
      setPlayer1Choice('');
      setPlayer2Choice('');
      setPlayer1Score(0);
      setPlayer2Score(0);
      setGameOver(false);
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please check your network connection and try again.');
    }
  };

  const handlePlayer1Choice = (choice) => {
    if (currentRound > 6) {
      alert('Game Over! Please start a new game.');
      return;
    }
    setPlayer1Choice(choice);
  };

  const handlePlayer2Choice = (choice) => {
    if (currentRound > 6) {
      alert('Game Over! Please start a new game.');
      return;
    }
    setPlayer2Choice(choice);
  };

  const determineWinner = async () => {
    if (player1Choice === '' || player2Choice === '') {
      alert('Both players need to make a selection.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/games/${gameId}`, {
        round: currentRound,
        player1Choice,
        player2Choice,
      });
      const { data } = response;
      const { rounds, player1Score: newPlayer1Score, player2Score: newPlayer2Score } = data;
      setRounds(rounds);
      setPlayer1Score(newPlayer1Score);
      setPlayer2Score(newPlayer2Score);
      setCurrentRound(currentRound + 1);
      setPlayer1Choice('');
      setPlayer2Choice('');
      if (currentRound === 6) {
        setGameOver(true);
      }
    } catch (error) {
      console.error('Error determining winner:', error);
      alert('Failed to determine winner. Please check your network connection and try again.');
    }
  };

  return (
    <div className="App">
      <h1>Rock Paper Scissors Game</h1>
      {!gameStarted && (
        <div>
          <input type="text" placeholder="Player 1 Name" value={player1} onChange={e => setPlayer1(e.target.value)} />
          <input type="text" placeholder="Player 2 Name" value={player2} onChange={e => setPlayer2(e.target.value)} />
          <button onClick={startGame}>Start Game</button>
        </div>
      )}
      {gameStarted && !gameOver && currentRound <= 6 && (
        <div className="choices">
          <p>{player1}'s Turn:</p>
          <button onClick={() => handlePlayer1Choice('stone')}>Stone</button>
          <button onClick={() => handlePlayer1Choice('paper')}>Paper</button>
          <button onClick={() => handlePlayer1Choice('scissors')}>Scissors</button>
          <p>{player2}'s Turn:</p>
          <button onClick={() => handlePlayer2Choice('stone')}>Stone</button>
          <button onClick={() => handlePlayer2Choice('paper')}>Paper</button>
          <button onClick={() => handlePlayer2Choice('scissors')}>Scissors</button>
          <button onClick={determineWinner}>Submit</button>
          <div className="rounds">
            {rounds.map(round => (
              <div key={round.round} className="round">
                <p>Round {round.round}: {round.player1} vs {round.player2} - Winner: {round.winner}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {gameOver && (
        <div className="scoreboard">
          <h2>Game Over!</h2>
          <h3>Final Scores:</h3>
          <p>{player1}: {player1Score} - {player2}: {player2Score}</p>
        </div>
      )}
    </div>
  );
}

export default App;
