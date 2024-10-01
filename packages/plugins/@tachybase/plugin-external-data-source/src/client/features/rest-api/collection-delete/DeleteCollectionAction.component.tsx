import React, { useState } from 'react';
import { ActionContextProvider, RecordProvider } from '@tachybase/client';

import { DeleteOutlined } from '@ant-design/icons';
import { App, Button } from 'antd';
import _ from 'lodash';

import { useTranslation } from '../../../locale';
import { useBulkDestroyActionAndRefreshCM } from './useBulkDestroyActionAndRefreshCM';
import { useDestroyActionAndRefreshCM } from './useDestroyActionAndRefreshCM';

export const DeleteCollectionAction = (props) => {
  const { t } = useTranslation();
  const { modal } = App.useApp();

  const { item, isBulk, children, ...restProps } = props;
  const targetProps = _.omit(restProps, ['scope', 'getContainer', 'useAction']);
  const [visible, setVisible] = useState(false);
  const { run } = isBulk ? useBulkDestroyActionAndRefreshCM() : useDestroyActionAndRefreshCM();
  const onClick = () => {
    modal.confirm({
      title: t('Delete collection'),
      content: t('Are you sure you want to delete it?'),
      onOk: run,
    });
  };
  return (
    <RecordProvider record={item}>
      <ActionContextProvider value={{ visible, setVisible }}>
        {isBulk ? (
          <Button icon={<DeleteOutlined />} onClick={onClick} children={children || t('Delete')} />
        ) : (
          <a onClick={onClick} {...targetProps}>
            {children || t('Delete')}
          </a>
        )}
      </ActionContextProvider>
    </RecordProvider>
  );
};
DeleteCollectionAction.displayName = 'DeleteCollectionAction';
