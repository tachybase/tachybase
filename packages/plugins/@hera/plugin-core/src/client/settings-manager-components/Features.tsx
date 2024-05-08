import { useApp } from '@tachybase/client';
import { Card, Divider, List, Typography } from 'antd';
import React from 'react';
import PluginCoreClient from '..';

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

export const Features = () => {
  const app = useApp();
  const plugin = app.pm.get(PluginCoreClient);
  return (
    <Card>
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text mark>[ITEM]</Typography.Text> {item}
          </List.Item>
        )}
      />
    </Card>
  );
};
