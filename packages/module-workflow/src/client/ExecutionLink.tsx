import React from 'react';
import { useActionContext, useRecord } from '@tachybase/client';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { getWorkflowExecutionsPath } from './utils';

export const ExecutionLink = () => {
  const { t } = useTranslation();
  const { id } = useRecord();
  const { setVisible } = useActionContext();
  return (
    <Link to={getWorkflowExecutionsPath(id)} onClick={() => setVisible(false)}>
      {t('View')}
    </Link>
  );
};
