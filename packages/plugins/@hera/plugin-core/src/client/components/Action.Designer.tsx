import { ISchema, useFieldSchema } from '@formily/react';
import { SchemaSettingsModalItem, useDesignable } from '@nocobase/client';
import { useTranslation } from '../locale';
import React from 'react';

export function AfterSuccess() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const component = fieldSchema.parent.parent['x-component'];
  const schema = {
    type: 'object',
    title: t('After successful submission'),
    properties: {
      successMessage: {
        title: t('Popup message'),
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {},
      },
      dataClear: {
        title: t('Clear data method'),
        enum: [
          { label: t('Automatic clear'), value: false },
          { label: t('Manually clear'), value: true },
        ],
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': {},
      },
      manualClose: {
        title: t('Popup close method'),
        enum: [
          { label: t('Automatic close'), value: false },
          { label: t('Manually close'), value: true },
        ],
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': {},
      },
      redirecting: {
        title: t('Then'),
        enum: [
          { label: t('Stay on current page'), value: false },
          { label: t('Redirect to'), value: true },
        ],
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': {},
        'x-reactions': {
          target: 'redirectTo',
          fulfill: {
            state: {
              visible: '{{!!$self.value}}',
            },
          },
        },
      },
      redirectTo: {
        title: t('Link'),
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
      },
    },
  };
  if (!(component as string).includes('Form')) {
    delete schema.properties.dataClear;
  }
  return (
    <SchemaSettingsModalItem
      title={t('After successful submission')}
      initialValues={fieldSchema?.['x-action-settings']?.['onSuccess']}
      schema={{ ...schema } as ISchema}
      onSubmit={(onSuccess) => {
        fieldSchema['x-action-settings']['onSuccess'] = onSuccess;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-action-settings': fieldSchema['x-action-settings'],
          },
        });
      }}
    />
  );
}
