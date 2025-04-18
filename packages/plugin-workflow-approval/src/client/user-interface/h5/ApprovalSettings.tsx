import { SchemaSettings, SchemaSettingsDataScope, useDesignable, useFormBlockContext } from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';

export const ApprovalSettings = new SchemaSettings({
  name: 'ApprovalSettings',
  items: [
    {
      name: 'setTheDataScope',
      Component: SchemaSettingsDataScope,
      useComponentProps() {
        const fieldSchema = useFieldSchema();
        const collectionName = fieldSchema['x-component-props']['collectionName'];
        const field = useField();
        const { form } = useFormBlockContext();
        const { dn } = useDesignable();
        const tabKey = fieldSchema['x-component-props']?.['tabKey'];
        let defaultFilter = {};
        if (tabKey && field.componentProps.params) {
          defaultFilter = field.componentProps.params[tabKey];
        } else if (tabKey && !field.componentProps.params) {
          defaultFilter = field.componentProps.parantParams?.[tabKey];
        }
        return {
          collectionName,
          defaultFilter: tabKey ? defaultFilter : fieldSchema?.['x-component-props']?.params || {},
          form: form,
          onSubmit: ({ filter }) => {
            let params;
            if (tabKey) {
              params = { ...field.componentProps?.params };
              params[tabKey] = {
                ...field.componentProps?.params?.[tabKey],
                ...filter,
              };
            } else {
              params = {
                ...field.componentProps?.params,
                ...filter,
              };
            }
            _.set(field.componentProps, 'params', {
              ...params,
            });
            fieldSchema['x-component-props']['params'] = field.componentProps.params;
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-component-props': fieldSchema['x-component-props'],
              },
            });
            if (tabKey) {
              dn.emit('patch', {
                schema: {
                  ['x-uid']: fieldSchema['x-component-props']['parantUid'],
                  'x-component-props': { params: fieldSchema['x-component-props']['params'] },
                },
              });
            }
          },
        };
      },
      useVisible() {
        const fieldSchema = useFieldSchema();
        return fieldSchema['x-component-props']['settingBlock'];
      },
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'delete',
      type: 'remove',
      sort: 100,
    },
  ],
});
