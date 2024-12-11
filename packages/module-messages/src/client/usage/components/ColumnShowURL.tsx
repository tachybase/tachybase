import React from 'react';
import { useCollectionRecordData } from '@tachybase/client';

import { useTranslation } from '../../locale';

export const ColumnShowURL = () => {
  const { t } = useTranslation();
  const recordData = useCollectionRecordData();
  const { schemaName } = recordData || {};
  const url = `${location.origin}/r/${schemaName}`;

  return (
    <a href={url} target="_blank">
      {t('External link')}
    </a>
  );
};
