import React from 'react';
import { useActionContext, useGetAriaLabelOfAction, useRecord } from '@tachybase/client';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { getWorkflowDetailPath } from './utils';

export const WorkflowLink = () => {
  const { t } = useTranslation();
  const { id } = useRecord();
  const { setVisible } = useActionContext();
  const { getAriaLabel } = useGetAriaLabelOfAction('Configure');

  return (
    <Link aria-label={getAriaLabel()} to={getWorkflowDetailPath(id)} onClick={() => setVisible(false)}>
      {t('Configure')}
    </Link>
  );
};
