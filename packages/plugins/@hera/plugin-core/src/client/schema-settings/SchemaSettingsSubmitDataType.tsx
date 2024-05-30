import React from 'react';
import { SchemaSettingsSwitchItem, useDesignable } from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import { useTranslation } from '../locale';

// 选择提交数据方式,是否增量提交,默认全量提交
export const SchemaSettingsSubmitDataType = () => {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  return (
    <SchemaSettingsSwitchItem
      title={t('Select submit data type')}
      checked={!!fieldSchema?.['x-action-settings']?.isDeltaChanged}
      onChange={(value) => {
        fieldSchema['x-action-settings'].isDeltaChanged = value;
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

SchemaSettingsSubmitDataType.displayName = 'SchemaSettingsSubmitDataType';
