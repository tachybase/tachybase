import React from 'react';
import { ActionContextProvider, SchemaComponentContext } from '@tachybase/client';

import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';

import { useTranslation } from '../../../../../locale';

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
