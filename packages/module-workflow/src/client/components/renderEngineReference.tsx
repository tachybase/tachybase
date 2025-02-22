import React from 'react';
import { css, i18n } from '@tachybase/client';
import { evaluators } from '@tachybase/evaluators/client';

export const renderEngineReference = (key: string) => {
  const engine = evaluators.get(key);
  if (!engine) {
    return null;
  }

  return engine.link ? (
    <>
      <span
        className={css`
          &:after {
            content: ':';
          }
          & + a {
            margin-left: 0.25em;
          }
        `}
      >
        {i18n.t('Syntax references')}
      </span>
      <a href={engine.link} target="_blank" rel="noreferrer">
        {engine.label}
      </a>
    </>
  ) : null;
};
