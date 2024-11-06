import React from 'react';

import styles from './InstaloseToast.module.css';

export default function InstaloseToast({ open }: { open: boolean }) {
  return (
    <dialog className={styles.dialog} open={open}>
      Out of time!
    </dialog>
  );
}
