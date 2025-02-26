import React, { useMemo } from 'react';
import { GeneralField, Schema } from '@tachybase/schema';

import { Designable } from '../../../schema-component';
import { SchemaSettingsProps } from '../../../schema-settings';
import { useApp } from '../../hooks';
import { SchemaSettingsWrapper } from '../components';
import { defaultSettingItems } from '../SchemaSettingsDefaults';
import { SchemaSettingOptions } from '../types';

type UseSchemaSettingsRenderOptions<T = {}> = Omit<SchemaSettingOptions<T>, 'name' | 'items'> &
  Omit<SchemaSettingsProps, 'title' | 'children'> & {
    fieldSchema?: Schema;
    field?: GeneralField;
    dn?: Designable;
  };

export function useSchemaSettingsRender<T = {}>(name: string, options?: UseSchemaSettingsRenderOptions<T>) {
  const app = useApp();
  const schemaSetting = useMemo(() => app.schemaSettingsManager.get<T>(name), [app.schemaSettingsManager, name]);

  if (!name) {
    return {
      exists: false,
      render: () => null,
    };
  }

  if (!schemaSetting) {
    console.error(`[tachybase]: SchemaSettings "${name}" not found`);
    return {
      exists: false,
      render: () => null,
    };
  }
  return {
    exists: true,
    render: (options2: UseSchemaSettingsRenderOptions = {}) => {
      const newItems = [...defaultSettingItems, ...schemaSetting.options.items];
      const newOptions = { ...schemaSetting.options, items: newItems };
      return React.createElement(SchemaSettingsWrapper, {
        ...newOptions,
        ...options,
        ...options2,
      });
    },
  };
}
