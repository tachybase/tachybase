import React from 'react';
import { ViewFieldAction as ViewCollectionFieldAction } from '@tachybase/client';

import { EyeOutlined } from '@ant-design/icons';

import { getPopupContainer } from '../utils';

export const ViewFieldAction = ({ item: record, parentItem: parentRecord }) => {
  return (
    <ViewCollectionFieldAction item={{ ...record }} parentItem={parentRecord} getContainer={getPopupContainer}>
      <EyeOutlined className="btn-view" />
    </ViewCollectionFieldAction>
  );
};
