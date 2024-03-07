import { FormOutlined } from '@ant-design/icons';
import { FormLayout } from '@formily/antd-v5';
import { SchemaOptionsContext } from '@formily/react';
import { createFormBlockSchema, useAPIClient, useCollectionManager_deprecated } from '@nocobase/client';
import {
  DataBlockInitializer,
  FormDialog,
  SchemaComponent,
  SchemaComponentOptions,
  useGlobalTheme,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

export const SettingBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const { t } = useTranslation();
  const options = useContext(SchemaOptionsContext);
  const { theme } = useGlobalTheme();
  const itemConfig = useSchemaInitializerItem();
  const { getCollection } = useCollectionManager_deprecated();
  const api = useAPIClient();
  return (
    <DataBlockInitializer
      {...itemConfig}
      componentType={'FormItem'}
      icon={<FormOutlined />}
      onCreateBlockSchema={async ({ item }) => {
        const collection = getCollection(item.name);
        const titleField = collection.options.titleField;
        const result = await api.resource(collection.name).list();
        const values = await FormDialog(
          t('添加单条数据展示区块'),
          () => {
            return (
              <SchemaComponentOptions scope={options.scope} components={{ ...options.components }}>
                <FormLayout layout={'vertical'}>
                  <SchemaComponent
                    schema={{
                      properties: {
                        id: {
                          title: t('选择数据'),
                          enum: result.data.data.map((item) => {
                            return {
                              label: item[titleField],
                              value: item.id,
                            };
                          }),
                          required: true,
                          'x-component': 'Select',
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
        const formSchema = createFormBlockSchema({
          dataSource: item.dataSource,
          collection: collection.name,
          action: 'get',
          filterByTk: values.id,
          actionInitializers: 'UpdateFormActionInitializers',
        });
        insert(formSchema);
      }}
    />
  );
};
