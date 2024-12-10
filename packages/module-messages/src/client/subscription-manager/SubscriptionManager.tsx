import React from 'react';
import { useAPIClient, useCurrentUserContext, usePlugin } from '@tachybase/client';

import { App, Card, Switch } from 'antd';

import ModuleMessagesClient from '..';
import { useTranslation } from '../locale';

export const SubscriptionManager = () => {
  const plugin = usePlugin<ModuleMessagesClient>('messages');
  const user = useCurrentUserContext();
  return (
    <Card>
      {plugin.messageTypes.map((type) => (
        <NoticeSettingItem service={user} type={type} key={type.name} />
      ))}
    </Card>
  );
};

const NoticeSettingItem = ({ service, type }) => {
  const prefs = service?.data?.data?.subPrefs || {};
  const api = useAPIClient();
  const { t } = useTranslation();
  const { message } = App.useApp();
  const pref = prefs[type.name] || {};

  const handleSwitchChange = async (checked) => {
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
    if (result.status === 200) {
      message.success(t('Edited successfully'));
    }
    service.mutate({
      data: {
        ...service?.data?.data,
        ...result.data.data[0],
      },
    });
  };

  return (
    <p>
      {type.title}
      <Switch checked={pref.enable} onChange={handleSwitchChange} />
    </p>
  );
};
