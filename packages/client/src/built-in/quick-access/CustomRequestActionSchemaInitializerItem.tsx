import React from 'react';

import { useTranslation } from 'react-i18next';

import { SchemaSettings, useSchemaInitializer } from '../../application';
import { SchemaSettingsActionLinkItem } from '../../modules/actions/link/customizeLinkActionSettings';
import { ButtonEditor } from '../../schema-component';
import { ModalActionSchemaInitializerItem } from './ModalActionSchemaInitializerItem';

export const quickAccessActionSettingsCustomRequest = new SchemaSettings({
  name: 'quickAccess:actionSettings:customRequest',
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

export function QuickAccessCustomRequestActionSchemaInitializerItem(props) {
  // 调用插入功能
  const { insert } = useSchemaInitializer();
  const { t } = useTranslation();
  return (
    <ModalActionSchemaInitializerItem
      title={t('Custom request')}
      modalSchema={{
        title: t('Add custom request'),
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
          'x-component': 'QuickAccessAction',
          'x-component-props': {
            icon: values.icon,
            iconColor: values.iconColor,
            targetComponent: 'CustomRequestAction',
          },
          'x-action': 'customize:form:request',
          'x-toolbar': 'ActionSchemaToolbar',
          'x-settings': 'actionSettings:customRequest',
          'x-decorator': 'CustomRequestAction.Decorator',
          'x-action-settings': {
            onSuccess: {
              manualClose: false,
              redirecting: false,
              successMessage: '{{t("Request success")}}',
            },
          },
        });
      }}
    />
  );
}
