import React from 'react';

import pngMine from '../../assets/images/mine.png';
import { useGameStateContext } from '../../hooks/useGameStateContext';
import styles from '../../styles/counter.module.css';

export default function MineCounter() {
  const { gameState } = useGameStateContext();

  const { tiles } = gameState;

  const numOfMines = tiles.filter((t) => t.isMine).length;
  const numOfFlags = tiles.filter((t) => t.flagStatus === 'flagged').length;

  return (
    <div className={styles.counter}>
      <span>{numOfMines - numOfFlags}</span>
      <img src={pngMine} />
    </div>
  );
}
