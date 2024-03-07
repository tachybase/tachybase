import { FormOutlined } from '@ant-design/icons';
import { FormLayout } from '@formily/antd-v5';
import { SchemaOptionsContext } from '@formily/react';
import {
  DataBlockInitializer,
  FormDialog,
  SchemaComponent,
  SchemaComponentOptions,
  useCollectionManager_deprecated,
  useGlobalTheme,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createCalendarBlockSchema } from './utils';

export const CalendarBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const { t } = useTranslation();
  const { getCollectionField, getCollectionFieldsOptions } = useCollectionManager_deprecated();
  const options = useContext(SchemaOptionsContext);
  const { theme } = useGlobalTheme();
  const itemConfig = useSchemaInitializerItem();

  return (
    <DataBlockInitializer
      {...itemConfig}
      componentType={'Calendar'}
      icon={<FormOutlined />}
      onCreateBlockSchema={async ({ item }) => {
        const stringFieldsOptions = getCollectionFieldsOptions(item.name, 'string');
        const dateFieldsOptions = getCollectionFieldsOptions(item.name, 'date', {
          association: ['o2o', 'obo', 'oho', 'm2o'],
        });

        const values = await FormDialog(
          t('Create calendar block'),
          () => {
            return (
              <SchemaComponentOptions scope={options.scope} components={{ ...options.components }}>
                <FormLayout layout={'vertical'}>
                  <SchemaComponent
                    schema={{
                      properties: {
                        title: {
                          title: t('Title field'),
                          enum: stringFieldsOptions,
                          required: true,
                          'x-component': 'Select',
                          'x-decorator': 'FormItem',
                        },
                        start: {
                          title: t('Start date field'),
                          enum: dateFieldsOptions,
                          required: true,
                          default: getCollectionField(`${item.name}.createdAt`) ? 'createdAt' : null,
                          'x-component': 'Cascader',
                          'x-decorator': 'FormItem',
                        },
                        end: {
                          title: t('End date field'),
                          enum: dateFieldsOptions,
                          'x-component': 'Cascader',
                          'x-decorator': 'FormItem',
                        },
                      },
                    }}
                  />
                </FormLayout>
              </SchemaComponentOptions>
            );
          },
          theme,
        ).open({
          initialValues: {},
        });
        insert(
          createCalendarBlockSchema({
            collection: item.name,
            fieldNames: {
              ...values,
            },
          }),
        );
      }}
    />
  );
};
