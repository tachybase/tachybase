import React from 'react';
import { useField, useFieldSchema } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

import { SchemaSettings } from '../../application';
import { useDesignable } from '../../schema-component';
import { SchemaSettingsSelectItem } from '../../schema-settings';
import { CustomSchemaSettingsBlockTitleItem } from './SchemaSettingsBlockTitleItem';

export const QuickAccessLayout = {
  Grid: 'grid',
  List: 'list',
};

const ActionPanelLayout = () => {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { dn } = useDesignable();
  return (
    <SchemaSettingsSelectItem
      title={t('Layout')}
      options={[
        { label: t('Grid'), value: QuickAccessLayout.Grid },
        { label: t('List'), value: QuickAccessLayout.List },
      ]}
      value={fieldSchema?.['x-component-props']?.layout || QuickAccessLayout.Grid}
      onChange={(value) => {
        field.componentProps.layout = value;
        const schema = {
          'x-uid': fieldSchema['x-uid'],
        };
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        schema['x-component-props'] = fieldSchema['x-component-props'] || {};
        schema['x-component-props'].layout = value;
        fieldSchema['x-component-props'].layout = value;
        dn.emit('patch', {
          schema: schema,
        });
        dn.refresh();
      }}
    />
  );
};

export const quickAccessBlockSettings = new SchemaSettings({
  name: 'blockSettings:quickAccess',
  items: [
    {
      name: 'title',
      Component: CustomSchemaSettingsBlockTitleItem,
    },
    {
      name: 'layout',
      Component: ActionPanelLayout,
    },
    {
      type: 'remove',
      name: 'remove',
    },
  ],
});
