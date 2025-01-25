import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import Menu from './components/Menu';
import './App.css';

const cardImages = [
  { name: 'A', image: 'https://via.placeholder.com/100' },
  { name: 'B', image: 'https://via.placeholder.com/100' },
  { name: 'C', image: 'https://via.placeholder.com/100' },
  { name: 'D', image: 'https://via.placeholder.com/100' },
  { name: 'E', image: 'https://via.placeholder.com/100' },
  { name: 'F', image: 'https://via.placeholder.com/100' },
  { name: 'G', image: 'https://via.placeholder.com/100' },
  { name: 'H', image: 'https://via.placeholder.com/100' },
  { name: 'I', image: 'https://via.placeholder.com/100' },
  { name: 'J', image: 'https://via.placeholder.com/100' },
  { name: 'K', image: 'https://via.placeholder.com/100' },
  { name: 'L', image: 'https://via.placeholder.com/100' },
  { name: 'M', image: 'https://via.placeholder.com/100' },
  { name: 'N', image: 'https://via.placeholder.com/100' },
  { name: 'O', image: 'https://via.placeholder.com/100' },
  { name: 'P', image: 'https://via.placeholder.com/100' },
];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [gameMode, setGameMode] = useState(16); // Default game mode
  const [background, setBackground] = useState('#ffffff');
  const [history, setHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Initialize the game based on the selected game mode
  useEffect(() => {
    const pairs = cardImages.slice(0, gameMode / 2).flatMap((card, index) => [
      { ...card, id: index * 2 },
      { ...card, id: index * 2 + 1 },
    ]);
    const shuffledCards = shuffleArray(pairs);
    setCards(shuffledCards);
    setStartTime(Date.now());
    setFlippedCards([]);
    setMatchedCards([]);
    setGameOver(false);
  }, [gameMode]);

  // Handle card click
  const handleClick = (card) => {
    if (flippedCards.length < 2 && !flippedCards.includes(card) && !matchedCards.includes(card)) {
      setFlippedCards([...flippedCards, card]);
    }
  };

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setDisabled(true);
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.name === secondCard.name) {
        setMatchedCards([...matchedCards, firstCard, secondCard]);
        resetTurn();
      } else {
        setTimeout(resetTurn, 1000);
      }
    }
  }, [flippedCards]);

  // Reset flipped cards
  const resetTurn = () => {
    setFlippedCards([]);
    setDisabled(false);
  };

  // Check if the game is over
  useEffect(() => {
    if (matchedCards.length === gameMode && !gameOver) {
      setEndTime(Date.now());
      setGameOver(true);
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const score = gameMode / 2;
      const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
      gameHistory.push({ score, timeTaken, date: new Date().toLocaleString() });
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
      setHistory(gameHistory);
    }
  }, [matchedCards, gameMode, gameOver, startTime]);

  return (
    <div className="App" style={{ backgroundColor: background }}>
      <Menu
        setGameMode={setGameMode}
        setBackground={setBackground}
        history={history}
      />
      <h1>Memory Card Game</h1>
      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleClick={handleClick}
            flipped={flippedCards.includes(card) || matchedCards.includes(card)}
            disabled={disabled}
          />
        ))}
      </div>
      {gameOver && (
        <div>
          <h2>Congratulations! You've matched all the cards!</h2>
          <button
            onClick={() => {
              setCards([]);
              setFlippedCards([]);
              setMatchedCards([]);
              setDisabled(false);
              setGameOver(false);
              const pairs = cardImages.slice(0, gameMode / 2).flatMap((card, index) => [
                { ...card, id: index * 2 },
                { ...card, id: index * 2 + 1 },
              ]);
              const shuffledCards = shuffleArray(pairs);
              setCards(shuffledCards);
              setStartTime(Date.now());
            }}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;