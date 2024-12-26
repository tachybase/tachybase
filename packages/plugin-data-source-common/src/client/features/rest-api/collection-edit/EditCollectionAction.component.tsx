import React, { useState } from 'react';
import { ActionContextProvider, RecordProvider } from '@tachybase/client';

import { lang, useTranslation } from '../../../locale';
import { ViewEditCollectionForm } from './EditCollectionForm.view';

export const EditCollectionAction = (props) => {
  const { t } = useTranslation();
  const { scope, getContainer, item } = props;
  const [visible, setVisible] = useState(false);

  return (
    <RecordProvider record={item}>
      <ActionContextProvider value={{ visible, setVisible }}>
        <a onClick={() => setVisible(true)}>{lang('Edit')}</a>
        <ViewEditCollectionForm scope={scope} item={item} getContainer={getContainer} />
      </ActionContextProvider>
    </RecordProvider>
  );
};
