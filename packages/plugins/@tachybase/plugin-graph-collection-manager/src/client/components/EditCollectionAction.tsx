import React from 'react';
import { EditCollection } from '@tachybase/client';

import { EditOutlined } from '@ant-design/icons';

import { useCancelAction, useUpdateCollectionActionAndRefreshCM } from '../action-hooks';
import { getPopupContainer } from '../utils';

export const EditCollectionAction = ({ item: record, className }) => {
  return (
    <EditCollection
      item={record}
      scope={{
        useCancelAction,
        useUpdateCollectionActionAndRefreshCM,
        createOnly: false,
      }}
      getContainer={getPopupContainer}
    >
      <EditOutlined className={className} />
    </EditCollection>
  );
};
