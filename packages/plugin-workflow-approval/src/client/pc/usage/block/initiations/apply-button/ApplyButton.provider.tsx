import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActionContextProvider,
  CollectionProvider_deprecated,
  css,
  parseCollectionName,
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentContext,
  useAPIClient,
} from '@tachybase/client';

import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';

import { useTranslation } from '../../../../locale';
import { FlowContextProvider } from '../../common/FlowContext.provider';
import { useActionResubmit } from '../hooks/useActionResubmit';
import { ActionBarProvider } from './ActionBar.provider';
import { ApplyActionStatusProvider } from './ActionStatus.provider';
import { WithdrawActionProvider } from './ActionWithdraw.provider';
import { useSubmitCreate } from './hooks/useSubmitCreate';
import { useWithdrawAction } from './hooks/useWithdrawAction';

export const ProviderApplyButton = (props) => {
  const { visible, setVisible, items, onClick, context, children } = props;
  const { t } = useTranslation();

  return (
    <ActionContextProvider value={{ visible, setVisible }}>
      <Dropdown
        menu={{
          items: items.map(({ id, title }) => ({
            key: id,
            label: title,
          })),
          onClick,
        }}
        disabled={!items.length}
      >
        <Button icon={<PlusOutlined />} type="primary">
          {t('Apply')}
          <DownOutlined />
        </Button>
      </Dropdown>
      <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
        {children}
      </SchemaComponentContext.Provider>
    </ActionContextProvider>
  );
};
