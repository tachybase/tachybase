import { ISchema } from '@nocobase/schema';
import { uid } from '@nocobase/schema';
import { Card } from 'antd';
import React from 'react';
import { SchemaComponent } from '../schema-component';
import * as components from './Configuration';

const schema2: ISchema = {
  type: 'object',
  properties: {
    [uid()]: {
      'x-component': 'RoleTable',
    },
  },
};

export const ACLPane = () => {
  return (
    <Card data-testid="acl-pane-card" bordered={false}>
      <SchemaComponent components={components as any} schema={schema2} />
    </Card>
  );
};
