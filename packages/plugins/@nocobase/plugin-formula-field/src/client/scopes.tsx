import { css, i18n } from '@tachybase/client';
import { Evaluator, evaluators } from '@tachybase/evaluators/client';
import { Registry } from '@tachybase/utils/client';
import React from 'react';
import { NAMESPACE } from './locale';

export function renderExpressionDescription(key: string) {
  const engine = (evaluators as Registry<Evaluator>).get(key);

  return engine?.link ? (
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
        {i18n.t('Syntax references', { ns: NAMESPACE })}
      </span>
      <a href={engine.link} target="_blank" rel="noreferrer">
        {engine.label}
      </a>
    </>
  ) : null;
}
