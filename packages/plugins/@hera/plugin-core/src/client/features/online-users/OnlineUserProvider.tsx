import React, { useEffect, useState } from 'react';
import { PinnedPluginListProvider, SchemaComponentOptions, useAPIClient, useApp, useToken } from '@tachybase/client';
import { uid } from '@tachybase/schema';

import { Button, Dropdown } from 'antd';
import _ from 'lodash';

const OnlineUserManger = () => {
  const app = useApp();
  const [onlineUserItems, setOnlineUserItems] = useState([]);
  const api = useAPIClient();
  const { token } = useToken();
  useEffect(() => {
    app.ws.on('message', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data?.type === 'plugin-online-user') {
        const onlineUserItems = data.payload.users?.map((user) => {
          if (user) {
            return {
              key: uid(),
              label: user.nickname,
            };
          }
        });
        setOnlineUserItems(onlineUserItems);
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
        在线 {_.size(onlineUserItems)} 人
      </Button>
    </Dropdown>
  );
};

export const OnlineUserProvider = (props) => {
  return (
    <PinnedPluginListProvider
      items={{
        ou: { order: 230, component: 'OnlineUserManger', pin: true, isPublic: true },
      }}
    >
      <SchemaComponentOptions components={{ OnlineUserManger }}>{props.children}</SchemaComponentOptions>
    </PinnedPluginListProvider>
  );
};
