import React, { useEffect, useState } from 'react';
import { PinnedPluginListProvider, SchemaComponentOptions, useAPIClient, useApp, useToken } from '@tachybase/client';
import { uid } from '@tachybase/schema';

import { Button, Dropdown } from 'antd';
import _ from 'lodash';

import { useTranslation } from './locale';

const OnlineUserManger = () => {
  const app = useApp();
  const [onlineUserItems, setOnlineUserItems] = useState([]);
  const api = useAPIClient();
  const { token } = useToken();
  const { t } = useTranslation();
  useEffect(() => {
    app.ws.on('message', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data?.type === 'plugin-online-user') {
        const list: { userId: number; name: string; count: number }[] = [];
        for (const item of data.payload.users) {
          if (!item) {
            continue;
          }
          const exist = list.find((user) => user.userId === item.id);
          if (exist) {
            exist.count++;
            continue;
          }
          list.push({
            userId: item.id,
            name: item.nickname || item.username,
            count: 1,
          });
        }
        setOnlineUserItems(
          list.map((item) => {
            return {
              key: uid(),
              label: `${item.name}:${item.count}`,
            };
          }),
        );
      }
    });
  }, [app]);

  useEffect(() => {
    const data = {
      type: 'plugin-online-user:client',
      payload: {
        token: api.auth.getToken(),
      },
    };
    app.ws.send(JSON.stringify(data));
  }, []);

  return (
    <Dropdown menu={{ items: onlineUserItems }}>
      <Button style={{ width: 'auto', color: token.colorTextHeaderMenu }} type="text">
        {t('{{num}} people online', { num: _.size(onlineUserItems) })}
      </Button>
    </Dropdown>
  );
};

export const OnlineUserProvider = (props) => {
  return (
    <PinnedPluginListProvider
      items={{
        ou: { order: 230, component: 'OnlineUserManger', pin: true, isPublic: true, belongTo: 'pinnedmenu' },
      }}
    >
      <SchemaComponentOptions components={{ OnlineUserManger }}>{props.children}</SchemaComponentOptions>
    </PinnedPluginListProvider>
  );
};
