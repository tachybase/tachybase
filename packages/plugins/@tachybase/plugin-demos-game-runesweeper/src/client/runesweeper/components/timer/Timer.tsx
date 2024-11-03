import React, { useEffect, useState } from 'react';

import webpWatch from '../../assets/images/watch.webp';
import { useGameStateContext } from '../../hooks/useGameStateContext';
import { useSettingsContext } from '../../hooks/useSettingsContext';
import styles from '../../styles/counter.module.css';
import InstaloseToast from '../instaloseToast/InstaloseToast';
import RecordModal from '../recordModal/RecordModal';

export default function Timer() {
  const { gameState, setGameState } = useGameStateContext();
  const { settings } = useSettingsContext();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [recordModalShown, setRecordModalShown] = useState(false);
  const [instaloseModalOpen, setInstaloseModalOpen] = useState(false);
  const [record, setRecord] = useState<number | null>(null);
  const [prevRecord, setPrevRecord] = useState<number | null>(null);

  const { status } = gameState;
  const { numOfColumns, numOfRows, mineRatio, instalose } = settings;

  useEffect(() => {
    const prevRecordString = localStorage.getItem(`${numOfColumns * numOfRows}tiles${mineRatio}mineRatio`);
    setRecord(prevRecordString ? Number(prevRecordString) : null);
  }, [mineRatio, numOfColumns, numOfRows]);

  useEffect(() => {
    // Ironman/instalose mode
    if (status === 'during' && typeof record === 'number' && instalose && timeElapsed > record) {
      setInstaloseModalOpen(true);
      setTimeout(() => {
        setInstaloseModalOpen(false);
      }, 2475); // Make sure this interval is in sync with the animation duration in instaloseToast.module.scss
      return setGameState({ ...gameState, status: 'lost' });
    }
    if (status === 'during') {
      const timer = setInterval(() => {
        setTimeElapsed(Number((timeElapsed + 0.1).toFixed(1))); // Prevents JS floating-point arithmetic issues
      }, 100);
      return () => clearInterval(timer);
    }

    // Code for setting records
    if (status === 'won' && (typeof record !== 'number' || timeElapsed < record)) {
      setPrevRecord(record);
      setRecord(timeElapsed);
      setRecordModalShown(true);
      localStorage.setItem(`${numOfColumns * numOfRows}tiles${mineRatio}mineRatio`, timeElapsed.toString());
    }
  }, [status, timeElapsed]);

  // Reset the time between games
  useEffect(() => {
    if (status === 'pre') setTimeElapsed(0);
  }, [status]);

  return (
    <div className={styles.counter}>
      <RecordModal shown={recordModalShown} setShown={setRecordModalShown} record={record} oldRecord={prevRecord} />
      <InstaloseToast open={instaloseModalOpen} />
      {status !== 'pre' && <img src={webpWatch} />}
      <span>{status === 'pre' ? (record ? `Best: ${record}s` : 'No best time') : timeElapsed.toFixed(1) + 's'}</span>
    </div>
  );
}
