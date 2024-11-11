import React, { useEffect, useRef, type Dispatch } from 'react';

import mp4Chord from '../../assets/videos/chord.mp4';
import mp4Flag from '../../assets/videos/flag.mp4';
import styles from './AboutModal.module.css';

export default function AboutModal({ shown, setShown }: { shown: boolean; setShown: Dispatch<boolean> }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (shown) {
      dialogRef.current?.removeAttribute('open');
      dialogRef.current?.showModal();
    } else dialogRef.current?.close();
  }, [shown]);

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <header>
        <p>Welcome to</p>
        <h1>RuneSweeper</h1>
      </header>
      <section>
        <video src={mp4Flag} autoPlay disablePictureInPicture loop muted />
        <h2>Right-click on a tile to flag it or mark it as &quot;maybe&quot;</h2>
      </section>
      <section>
        <video src={mp4Chord} autoPlay disablePictureInPicture loop muted />
        <h2>
          Right-click or double-click on a number tile to{' '}
          <a href="https://en.wikipedia.org/wiki/Chording#Minesweeper_tactic" target="_blank" rel="noreferrer">
            chord
          </a>{' '}
          it
        </h2>
      </section>
      <section>
        <h2>On mobile, you can long-press or swipe instead of double-clicking or right-clicking.</h2>
      </section>
      <button
        className={styles.start}
        onClick={() => {
          localStorage.setItem('showAboutModal', 'false');
          setShown(false);
        }}
      >
        Play
      </button>
    </dialog>
  );
}
