import React from 'react';
import { useApp } from '@tachybase/client';

import { ErrorBoundary } from 'react-error-boundary';

import { useTranslation } from '../locale';

export const CloudComponentBlock = ({ element }) => {
  const { t } = useTranslation();
  const app = useApp();

  if (element && element !== 'CloudComponentVoid') {
    const Component = app.getComponent('CloudComponentVoid.' + element);

    return (
      <ErrorBoundary
        fallback={<div>{t('Something went wrong. Please contact the developer to resolve the issue.')}</div>}
      >
        <Component />
      </ErrorBoundary>
    );
  }
  return <div>{t('Please choose component to show here')}</div>;
};
