import { SchemaSettings, useApp, useDesignable } from '@tachybase/client';
import { Field, useField, useFieldSchema } from '@tachybase/schema';

import { useTranslation } from '../locale';

export const cloudComponentBlockSettings = new SchemaSettings({
  name: 'blockSettings:cloudComponent',
  items: [
    {
      name: 'component',
      type: 'select',
      useComponentProps() {
        const app = useApp();
        const CloudComponentVoid = app.getComponent('CloudComponentVoid');
        const { t } = useTranslation();
        const components = Object.getOwnPropertyNames(CloudComponentVoid)
          .filter((key) => typeof CloudComponentVoid[key] === 'function')
          .map((key) => {
            return {
              label: t(key),
              value: key,
            };
          });
        const field = useField<Field>();
        const fieldSchema = useFieldSchema();
        const { dn } = useDesignable();
        return {
          title: t('Cloud Component'),
          value: field.componentProps?.element || 'CloudComponentVoid',
          options: [
            {
              label: t('Not selected'),
              value: 'CloudComponentVoid',
            },
            ...components,
          ],
          onChange(element) {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            fieldSchema['x-component-props']['element'] = element;
            fieldSchema['x-acl-ignore'] = true;
            schema['x-component-props'] = fieldSchema['x-component-props'];
            schema['x-acl-ignore'] = true;
            field.componentProps.element = element;
            dn.emit('patch', {
              schema,
            });
          },
        };
      },
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      type: 'remove',
      name: 'remove',
    },
  ],
});
