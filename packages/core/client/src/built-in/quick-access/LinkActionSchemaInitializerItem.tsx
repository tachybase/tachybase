import React from 'react';

import { useTranslation } from 'react-i18next';

import { SchemaSettings, useSchemaInitializer, useSchemaInitializerItem } from '../../application';
import { SchemaSettingsActionLinkItem } from '../../modules/actions/link/customizeLinkActionSettings';
import { ButtonEditor } from '../../schema-component';
import { ModalActionSchemaInitializerItem } from './ModalActionSchemaInitializerItem';

export const quickAccessActionSettingsLink = new SchemaSettings({
  name: 'quickAccess:actionSettings:link',
  items: [
    {
      name: 'editButton',
      Component: ButtonEditor,
      useComponentProps() {
        return { hasIconColor: true };
      },
    },
    {
      name: 'editLink',
      Component: SchemaSettingsActionLinkItem,
    },
    {
      sort: 800,
      name: 'd1',
      type: 'divider',
    },
    {
      sort: 900,
      type: 'remove',
      name: 'remove',
    },
  ],
});

export function QuickAccessLinkActionSchemaInitializerItem(props) {
  const itemConfig = useSchemaInitializerItem();
  // 调用插入功能
  const { insert } = useSchemaInitializer();
  const { t } = useTranslation();
  return (
    <ModalActionSchemaInitializerItem
      title={itemConfig.title}
      modalSchema={{
        title: t('Add link'),
        properties: {
          title: {
            title: t('Title'),
            required: true,
            'x-component': 'Input',
            'x-decorator': 'FormItem',
          },
          icon: {
            title: t('Icon'),
            required: true,
            'x-component': 'IconPicker',
            'x-decorator': 'FormItem',
          },
          iconColor: {
            title: t('Color'),
            required: true,
            default: '#1677FF',
            'x-component': 'ColorPicker',
            'x-decorator': 'FormItem',
          },
        },
      }}
      onSubmit={(values) => {
        insert({
          type: 'void',
          title: values.title,
          'x-action': 'customize:link',
          'x-toolbar': 'ActionSchemaToolbar',
          'x-settings': 'quickAccess:actionSettings:link',
          'x-component': 'QuickAccessAction',
          'x-use-component-props': 'useLinkActionProps',
          'x-component-props': {
            icon: values.icon,
            iconColor: values.iconColor,
          },
        });
      }}
    />
  );
}
