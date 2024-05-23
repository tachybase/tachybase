import React, { useState } from 'react';
import {
  ActionContextProvider,
  SchemaComponent,
  useActionContext,
  useAPIClient,
  useAsyncData,
  useRequest,
} from '@tachybase/client';

import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';

import { useAuthTranslation } from '../locale';
import { AuthTypeContext, AuthTypesContext, useAuthTypes } from './authType';
import { Options, useValuesFromOptions } from './Options';
import { authenticatorsSchema, createFormSchema } from './schemas/authenticators';

const useCloseAction = () => {
  const { setVisible } = useActionContext();
  return {
    async run() {
      setVisible(false);
    },
  };
};

const AddNew = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('');
  const types = useAuthTypes();
  const items = types.map((item) => ({
    ...item,
    onClick: () => {
      setVisible(true);
      setType(item.value);
    },
  }));

  return (
    <ActionContextProvider value={{ visible, setVisible }}>
      <AuthTypeContext.Provider value={{ type }}>
        <Dropdown menu={{ items }}>
          <Button icon={<PlusOutlined />} type={'primary'}>
            {t('Add new')} <DownOutlined />
          </Button>
        </Dropdown>
        <SchemaComponent scope={{ useCloseAction, types, setType }} schema={createFormSchema} />
      </AuthTypeContext.Provider>
    </ActionContextProvider>
  );
};

// Disable delete button when there is only one authenticator
const useCanNotDelete = () => {
  const { data } = useAsyncData();
  // return data?.meta?.count === 1;
  return false;
};

export const Authenticator = () => {
  const { t } = useAuthTranslation();
  const [types, setTypes] = useState([]);
  const api = useAPIClient();
  useRequest(
    () =>
      api
        .resource('authenticators')
        .listTypes()
        .then((res) => {
          const types = res?.data?.data || [];
          return types.map((type: { name: string; title?: string }) => ({
            key: type.name,
            label: t(type.title || type.name),
            value: type.name,
          }));
        }),
    {
      onSuccess: (types) => {
        setTypes(types);
      },
    },
  );

  return (
    <Card bordered={false}>
      <AuthTypesContext.Provider value={{ types }}>
        <SchemaComponent
          schema={authenticatorsSchema}
          components={{ AddNew, Options }}
          scope={{ types, useValuesFromOptions, useCanNotDelete, t }}
        />
      </AuthTypesContext.Provider>
    </Card>
  );
};
