import React, { useEffect, useState } from 'react';

import confetti from 'canvas-confetti';

import Header from './components/header/Header';
import PregameTile from './components/tile/PregameTile';
import Tile from './components/tile/Tile';
import { GameStateContext, type GameState } from './hooks/useGameStateContext';
import { defaultSettings, SettingsContext, type Settings } from './hooks/useSettingsContext';
import styles from './Runesweeper.module.css';
import generateTiles from './utils/generateTiles';

const version = '1.0.7';

export function Runesweeper() {
  const settingsOnLoad: Settings = { ...defaultSettings };
  Object.keys(defaultSettings).forEach((key) => {
    // @ts-ignore
    if (localStorage.getItem(key)) settingsOnLoad[key] = JSON.parse(localStorage.getItem(key));
  });

  const [settings, setSettings] = useState<Settings>(settingsOnLoad);
  const [gameState, setGameState] = useState<GameState>({ tiles: [], status: 'pre' });

  const { numOfColumns, numOfRows, mineRatio, isLandscape } = settings;
  const { tiles, status } = gameState;

  // Update board when certain settings change
  useEffect(() => {
    setGameState({
      tiles: generateTiles(numOfColumns, numOfRows, mineRatio, isLandscape),
      status: 'pre',
    });
  }, [numOfColumns, numOfRows, isLandscape]);

  // Checks if you've done something to win, if you haven't already won or lost.
  // Losing is triggered elsewhere.
  useEffect(() => {
    if (status !== 'during') return;
    const numOfSweptNonMines = tiles.filter((t) => t.swept && !t.isMine).length;
    const numOfNonMines = tiles.filter((t) => !t.isMine).length;
    if (numOfNonMines === numOfSweptNonMines) {
      confetti({ startVelocity: 30, gravity: 2, spread: 140, origin: { y: 0.3 } });
      setGameState({ ...gameState, status: 'won' });
    }
  }, [gameState]);

  // The depending on which pre-game tile the user clicks, we generate a board such that
  // the tile they clicked triggers a cascade.
  const pregameTiles = tiles
    .filter((t) => t.c === 1)
    .map((_tile, index) => {
      return (
        <div key={index} className={styles.row}>
          {tiles
            .filter((t) => t.r === index + 1)
            .map((innerTile) => (
              <PregameTile id={innerTile.id} key={innerTile.id} />
            ))}
        </div>
      );
    });

  const gameTiles = tiles
    .filter((t) => t.c === 1)
    .map((_tile, index) => {
      return (
        <div key={index} className={styles.row}>
          {tiles
            .filter((t) => t.r === index + 1)
            .map((innerTile) => (
              <Tile tile={innerTile} key={innerTile.id} />
            ))}
        </div>
      );
    });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <GameStateContext.Provider value={{ gameState, setGameState }}>
        <div className={styles.runesweeper}>
          <div>
            <Header />
            <div className={styles.board}>{status === 'pre' ? pregameTiles : gameTiles}</div>
            <p className={styles.credits}>
              Made by Peter Liu &nbsp;&nbsp;|&nbsp;&nbsp;v{version}&nbsp;&nbsp;|&nbsp;&nbsp;
              <a href="https://github.com/PeterTYLiu/runesweeper" target="_blank" rel="noreferrer">
                Github
              </a>
            </p>
          </div>
        </div>
      </GameStateContext.Provider>
    </SettingsContext.Provider>
  );
}
