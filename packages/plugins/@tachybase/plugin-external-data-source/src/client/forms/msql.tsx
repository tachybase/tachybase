import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { tval, usePluginTranslation } from '../locale';

export const MysqlDataSourceSettingsForm = () => {
  const { t } = usePluginTranslation();
  return (
    <SchemaComponent
      scope={{ t }}
      schema={{
        type: 'object',
        properties: {
          key: {
            type: 'string',
            title: tval('Data source name'),
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-validator': 'uid',
            'x-disabled': '{{ createOnly }}',
            description: tval(
              'Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.',
            ),
          },
          displayName: {
            type: 'string',
            title: tval('Data source display name'),
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          options: {
            type: 'object',
            properties: {
              host: {
                type: 'string',
                title: tval('Host'),
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                default: 'localhost',
              },
              port: {
                type: 'string',
                title: tval('Port'),
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                default: 3306,
              },
              database: {
                type: 'string',
                title: tval('Database'),
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              username: {
                type: 'string',
                title: tval('Username'),
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              password: {
                type: 'string',
                title: tval('Password'),
                'x-decorator': 'FormItem',
                'x-component': 'Password',
              },
              tablePrefix: {
                type: 'string',
                title: tval('Table prefix'),
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          enabled: {
            type: 'string',
            'x-content': tval('Enabled the data source'),
            'x-decorator': 'FormItem',
            'x-component': 'Checkbox',
            default: true,
          },
        },
      }}
    />
  );
};
