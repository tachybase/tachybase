import { css } from '@tachybase/client';
import React from 'react';
import { useTranslation } from '../../locale';
export const ModeHighlightProvider = ({ children }) => {
  const { t } = useTranslation();
  return (
    <>
      <aside
        className={css`
          text-align: center;
          background-color: #dcdc49;
        `}
      >
        {t('Dev mode')}
      </aside>
      {children}
    </>
  );
};
