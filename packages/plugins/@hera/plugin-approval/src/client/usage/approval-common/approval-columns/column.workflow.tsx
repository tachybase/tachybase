import React from 'react';
import { css } from '@nocobase/client';
import { observer, useField, Field } from '@tachybase/schema';
import { useTranslation } from '../../../locale';

export const WorkflowColumn = observer(
  () => {
    const { t } = useTranslation();
    const { value } = useField<Field>();
    const title = value?.title || `#${value?.id}`;

    if (value?.enabled) {
      return title;
    } else {
      return (
        <span
          className={css`
            text-decoration: line-through;
          `}
          title={t('Disabled')}
        >
          {title}
        </span>
      );
    }
  },
  { displayName: 'WorkflowColumn' },
);
