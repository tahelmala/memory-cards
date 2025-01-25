import React from 'react';
import './Card.css';

const Card = ({ card, handleClick, flipped, disabled }) => {
  return (
    <div className={`card ${flipped ? 'flipped' : ''}`} onClick={() => !disabled && handleClick(card)}>
      <div className="card-front">
        <img src={card.image} alt={card.name} />
      </div>
      <div className="card-back">
        <span>?</span>
      </div>
    </div>
  );
};

export default Card;