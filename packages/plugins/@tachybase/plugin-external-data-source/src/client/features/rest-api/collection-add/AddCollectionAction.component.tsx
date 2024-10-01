import React, { useState } from 'react';
import { ActionContextProvider, RecordProvider } from '@tachybase/client';

import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { useTranslation } from '../../../locale';
import { ViewCreateCollection } from './CreateCollection.view';

export const AddCollectionAction = (props) => {
  const { t } = useTranslation(true);
  const { scope, getContainer, item } = props;
  const [visible, setVisible] = useState(false);
  const handleClick = () => setVisible(true);

  return (
    <RecordProvider record={item}>
      <ActionContextProvider value={{ visible, setVisible }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleClick}>
          {t('Create collection')}
        </Button>
        <ViewCreateCollection scope={scope} getContainer={getContainer} item={item} />
      </ActionContextProvider>
    </RecordProvider>
  );
};
