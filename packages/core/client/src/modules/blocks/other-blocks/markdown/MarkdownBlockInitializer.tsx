import React from 'react';

import { FileTextOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '../../../../application';

export const MarkdownBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const { t } = useTranslation();
  const itemConfig = useSchemaInitializerItem();

  return (
    <SchemaInitializerItem
      {...itemConfig}
      icon={<FileTextOutlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-settings': 'blockSettings:markdown',
          'x-decorator': 'CardItem',
          'x-decorator-props': {
            name: 'markdown',
          },
          'x-component': 'Markdown.Void',
          'x-editable': false,
          'x-component-props': {
            content: t('This is a demo text, **supports Markdown syntax**.'),
          },
        });
      }}
    />
  );
};
