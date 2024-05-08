import { EyeOutlined } from '@ant-design/icons';
import { ViewFieldAction as ViewCollectionFieldAction } from '@tachybase/client';
import React from 'react';
import { getPopupContainer } from '../utils';

export const ViewFieldAction = ({ item: record, parentItem: parentRecord }) => {
  return (
    <ViewCollectionFieldAction item={{ ...record }} parentItem={parentRecord} getContainer={getPopupContainer}>
      <EyeOutlined className="btn-view" />
    </ViewCollectionFieldAction>
  );
};
