import React from 'react';
import { Plugin, SchemaComponent } from '@nocobase/client';
import {} from '@nocobase/client';
import { PluginDataSourceManagerClient } from '@nocobase/plugin-data-source-manager/client';
import { Space } from 'antd';
import { generateNTemplate as tval, usePluginTranslation } from './locale';

const DataSourceSettingsForm = () => {
  const { t } = usePluginTranslation();
  return (
    <SchemaComponent
      scope={{ t }}
      components={{ Space }}
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
            required: !0,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          options: {
            type: 'object',
            properties: {
              host: {
                type: 'string',
                title: tval('Host'),
                required: !0,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                default: 'localhost',
              },
              port: {
                type: 'string',
                title: tval('Port'),
                required: !0,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                default: 5432,
              },
              database: {
                type: 'string',
                title: tval('Database'),
                required: !0,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              username: {
                type: 'string',
                title: tval('Username'),
                required: !0,
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
              schema: {
                type: 'string',
                title: tval('Schema'),
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

export class PluginExternalDataSourceClient extends Plugin {
  async load() {
    this.app.pm
      .get(PluginDataSourceManagerClient)
      .registerType('postgres', { DataSourceSettingsForm, label: tval('PostgreSQL') });
  }
}

export default PluginExternalDataSourceClient;
