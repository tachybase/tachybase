import { useFieldSchema } from '@formily/react';
import { SchemaSettingsSwitchItem, useDesignable } from '@nocobase/client';
import React from 'react';
import { useTranslation } from '../locale';

// 添加跳转页面选项
export const SessionSubmit = () => {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  return (
    <SchemaSettingsSwitchItem
      title={t('Navigate to new page')}
      checked={!!fieldSchema?.['x-action-settings']?.sessionSubmit}
      onChange={(value) => {
        fieldSchema['x-action-settings'].sessionSubmit = value;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-action-settings': {
              ...fieldSchema['x-action-settings'],
            },
          },
        });
      }}
    />
  );
};

export function SessionUpdate() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  return (
    <SchemaSettingsSwitchItem
      title={t('更新询问')}
      checked={!!fieldSchema?.['x-action-settings']?.sessionUpdate}
      onChange={(value) => {
        fieldSchema['x-action-settings'].sessionUpdate = value;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-action-settings': {
              ...fieldSchema['x-action-settings'],
            },
          },
        });
      }}
    />
  );
}
