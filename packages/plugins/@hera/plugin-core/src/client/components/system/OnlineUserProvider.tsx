import React, { useEffect, useState } from 'react';
import { css, useAPIClient, useApp } from '@tachybase/client';
import { uid } from '@tachybase/schema';

import { Button, Dropdown } from 'antd';
import _ from 'lodash';

const OnlineUserManger = () => {
  const app = useApp();
  const [onlineUserItems, setOnlineUserItems] = useState([]);
  const api = useAPIClient();
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
      <Button style={{ width: 'auto' }} type="text">
        在线 {_.size(onlineUserItems)} 人
      </Button>
    </Dropdown>
  );
};

export const OnlineUserDropdown = () => {
  return (
    <div
      className={css`
        .ant-btn {
          border: 0;
          height: var(--tb-header-height);
          width: 46px;
          border-radius: 0;
          background: none;
          color: rgba(255, 255, 255, 0.65) !important;
          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        }
      `}
      style={{ display: 'inline-block' }}
    >
      <OnlineUserManger />
    </div>
  );
};
