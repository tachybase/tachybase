import React, { useState } from 'react';

import webpHometele from '../../assets/images/hometele.webp';
import pngInfo from '../../assets/images/info.png';
import pngSettings from '../../assets/images/settings.png';
import { useGameStateContext } from '../../hooks/useGameStateContext';
import { useSettingsContext } from '../../hooks/useSettingsContext';
import generateTiles from '../../utils/generateTiles';
import AboutModal from '../aboutModal/AboutModal';
import MineCounter from '../mineCounter/MineCounter';
import SettingsModal from '../settingsModal/SettingsModal';
import Timer from '../timer/Timer';
import styles from './Header.module.css';

export default function Header() {
  const [settingsModalShown, setSettingsModalShown] = useState(false);
  const [aboutModalShown, setAboutModalShown] = useState(localStorage.getItem('showAboutModal') ? false : true);
  const { gameState, setGameState } = useGameStateContext();
  const { settings } = useSettingsContext();

  const { status } = gameState;

  // Reset to pre-game state
  function reset() {
    setGameState({
      tiles: generateTiles(settings.numOfColumns, settings.numOfRows, settings.mineRatio, settings.isLandscape),
      status: 'pre',
    });
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Timer />
      </div>
      {(status === 'won' || status === 'lost') && (
        <button className={styles.main} onClick={reset}>
          <img src={webpHometele} />
        </button>
      )}
      <div className={styles.right}>
        {status === 'during' ? (
          <MineCounter />
        ) : (
          <>
            <button onClick={() => setAboutModalShown(true)}>
              <img src={pngInfo} />
            </button>
            <button onClick={() => setSettingsModalShown(true)}>
              <img src={pngSettings} />
            </button>
          </>
        )}
      </div>
      <SettingsModal shown={settingsModalShown} setShown={setSettingsModalShown} />
      <AboutModal shown={aboutModalShown} setShown={setAboutModalShown} />
    </header>
  );
}
