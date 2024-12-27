import React, { useState } from 'react';
import { ActionContextProvider, RecordProvider, useAPIClient } from '@tachybase/client';

import { lang, useTranslation } from '../../../locale';
import { ViewEditCollectionForm } from './EditCollectionForm.view';

export const EditCollectionAction = (props) => {
  const { t } = useTranslation();
  const { scope, getContainer, item } = props;
  const [visible, setVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const apiClient = useAPIClient();
  const repo = apiClient.resource('dataSources.collections', item.dataSourceKey);

  return (
    <RecordProvider record={item}>
      <ActionContextProvider value={{ visible, setVisible }}>
        <a
          onClick={async () => {
            const collectionRecord = await repo.get({ filterByTk: item.key, appends: ['fields'] });
            setCurrentRecord(collectionRecord?.data?.data);
            setVisible(true);
          }}
        >
          {lang('Edit')}
        </a>
        <ViewEditCollectionForm scope={scope} item={currentRecord} getContainer={getContainer} />
      </ActionContextProvider>
    </RecordProvider>
  );
};
