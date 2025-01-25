import React, { useState } from 'react';
import './Menu.css';

const Menu = ({ setGameMode, setBackground, history }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="menu">
      <button onClick={() => setShowSettings(!showSettings)}>Settings</button>
      <button onClick={() => setShowHistory(!showHistory)}>Historique</button>

      {showSettings && (
        <div className="settings">
          <h3>Settings</h3>
          <label>
            Mode de jeu :
            <select onChange={(e) => setGameMode(Number(e.target.value))}>
              <option value={4}>4 Cartes</option>
              <option value={16}>16 Cartes</option>
              <option value={32}>32 Cartes</option>
            </select>
          </label>
          <label>
            Background :
            <input type="color" onChange={(e) => setBackground(e.target.value)} />
          </label>
        </div>
      )}

      {showHistory && (
        <div className="history">
          <h3>Historique</h3>
          <ul>
            {history.map((game, index) => (
              <li key={index}>
                Score: {game.score}, Temps: {game.timeTaken}s, Date: {game.date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Menu;