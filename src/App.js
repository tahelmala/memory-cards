import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import Menu from './components/Menu';
import './App.css';

const cardImages = [
  { name: 'A', image: '/images/a.jpg' },
  { name: 'B', image: '/images/b.jpg' },
  { name: 'D', image: '/images/d.jpg' },
  { name: 'C', image: '/images/c.jpg' },
  { name: 'E', image: '/images/e.jpg' },
  { name: 'F', image: '/images/f.jpg' },
  { name: 'G', image: '/images/g.jpg' },
  { name: 'H', image: '/images/h.jpg' },
  { name: 'I', image: '/images/i.jpg' },
  { name: 'J', image: '/images/j.jpg' },
  { name: 'K', image: '/images/k.jpg' },
  { name: 'L', image: '/images/l.jpg' },
  { name: 'M', image: '/images/m.jpg' },
  { name: 'N', image: '/images/n.jpg' },
  { name: 'O', image: '/images/o.jpg' },
  { name: 'P', image: '/images/p.jpg' },
];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [gameMode, setGameMode] = useState(16);
  const [background, setBackground] = useState('#ffffff');
  const [history, setHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);


  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

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

  const handleClick = (card) => {
    if (flippedCards.length < 2 && !flippedCards.includes(card) && !matchedCards.includes(card)) {
      setFlippedCards([...flippedCards, card]);
    }
  };

  //check when two cards are flipped
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
  }, [flippedCards, matchedCards]);

  const resetTurn = () => {
    setFlippedCards([]);
    setDisabled(false);
  };

  // Save game result to history
  const saveToHistory = React.useCallback((result) => {
    setHistory((prevHistory) => [...prevHistory, result]);
  }, []);

  //check game over and log history
    useEffect(() => {
    if (matchedCards.length === gameMode && !gameOver) {
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - startTime) / 1000); // Time in seconds

      // Save the game result to history
      saveToHistory({
        score: gameMode / 2,
        timeTaken,
        date: new Date().toLocaleString(),
      });

      // Mark the game as over
      setGameOver(true);
    }
  }, [matchedCards, gameMode, gameOver, startTime, saveToHistory]);

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
              // Reset the game
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