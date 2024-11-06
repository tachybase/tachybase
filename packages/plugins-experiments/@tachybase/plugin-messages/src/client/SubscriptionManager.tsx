import React from 'react';
import { useAPIClient, useCurrentUserContext, usePlugin } from '@tachybase/client';

import { App, Card, Switch } from 'antd';

import PluginMessagesClient from '.';
import { useTranslation } from './locale';

export const NoticeSettingItem = ({ service, type }) => {
  const prefs = service?.data?.data?.subPrefs || {};
  const api = useAPIClient();
  const { t } = useTranslation();
  const { message } = App.useApp();
  const pref = prefs[type.name] || {};
  return (
    <p>
      {type.title}
      <Switch
        checked={pref.enable}
        onChange={async (checked) => {
          const result = await api.resource('users').updateProfile({
            values: {
              subPrefs: {
                ...prefs,
                [type.name]: {
                  enable: checked,
                },
              },
            },
          });
          console.log('🚀 ~ file: SubscriptionManager.tsx:28 ~ result ~ result:', result);
          if (result.status === 200) {
            message.success(t('Edited successfully'));
          }
          service.mutate({
            data: {
              ...service?.data?.data,
              ...result.data.data[0],
            },
          });
        }}
      />
    </p>
  );
};

export const SubscriptionManager = () => {
  const plugin = usePlugin<PluginMessagesClient>('messages');
  const user = useCurrentUserContext();
  console.log('🚀 ~ file: SubscriptionManager.tsx:11 ~ SubscriptionManager ~ user:', user);
  console.log('🚀 ~ file: SubscriptionManager.tsx:8 ~ SubscriptionManager ~ plugin:', plugin);
  return (
    <Card>
      {plugin.messageTypes.map((type) => (
        <NoticeSettingItem service={user} type={type} key={type.name} />
      ))}
    </Card>
  );
};
