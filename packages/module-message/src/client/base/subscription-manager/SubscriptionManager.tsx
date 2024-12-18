import React from 'react';
import { useAPIClient, useCurrentUserContext, usePlugin } from '@tachybase/client';

import { App, Card, Switch } from 'antd';

import { useTranslation } from '../../locale';
import ModuleMessageClient from '../../plugin';

export const SubscriptionManager = () => {
  const moduleMessage = usePlugin(ModuleMessageClient);
  const channelList = Array.from(moduleMessage.channels.getValues());

  return (
    <Card>
      {channelList.map((channel) => (
        <NoticeSettingItem key={channel.name} channel={channel} />
      ))}
    </Card>
  );
};

const NoticeSettingItem = (props) => {
  const { channel } = props;
  const { name, title } = channel;
  const api = useAPIClient();
  const { t } = useTranslation();
  const { message } = App.useApp();
  const service = useCurrentUserContext();
  const subPrefs = service?.data?.data?.subPrefs || {};

  const pref = subPrefs[name] || {};

  const handleSwitchChange = async (checked) => {
    const result = await api.resource('users').updateProfile({
      values: {
        subPrefs: {
          ...subPrefs,
          [name]: {
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
      {title}
      <Switch checked={pref.enable} onChange={handleSwitchChange} />
    </p>
  );
};
