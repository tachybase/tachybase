import { SchemaSettingsItemType, useColumnSchema, useDesignable } from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';

import { useTranslation } from '../../locale';

export const enableLinkItem: SchemaSettingsItemType = {
  name: 'enableLink',
  type: 'switch',
  useVisible() {
    return useField().readPretty;
  },
  useComponentProps() {
    const { t } = useTranslation();
    const field = useField();
    const { fieldSchema: fieldSchema } = useColumnSchema();
    const columnSchema = useFieldSchema();
    const schema = fieldSchema || columnSchema;
    const { dn } = useDesignable();
    return {
      title: t('Enable link'),
      checked: schema['x-component-props']?.enableLink !== false,
      onChange(enableLink) {
        schema['x-component-props'] = {
          ...schema?.['x-component-props'],
          enableLink,
        };
        field.componentProps.enableLink = enableLink;
        dn.emit('patch', {
          schema: {
            'x-uid': schema['x-uid'],
            'x-component-props': {
              ...schema?.['x-component-props'],
            },
          },
        });
        dn.refresh();
      },
    };
  },
};
