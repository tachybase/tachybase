import React from 'react';
import { AddCollection } from '@tachybase/client';

import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { useCancelAction } from '../action-hooks';
import { getPopupContainer } from '../utils';

export const AddCollectionAction = ({ item: recordData }) => {
  return (
    <AddCollection
      trigger={['click']}
      align={{
        overflow: {
          adjustY: false, // 关闭溢出位置调整
        },
      }}
      item={recordData}
      scope={{
        useCancelAction,
      }}
      getContainer={getPopupContainer}
    >
      <Button type="primary">
        <PlusOutlined />
      </Button>
    </AddCollection>
  );
};
