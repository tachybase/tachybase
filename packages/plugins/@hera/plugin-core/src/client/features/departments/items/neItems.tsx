import { useDesignable } from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';
import { useTranslation } from '../../../locale';
import { useHooksOoe } from '../hooks/useHooksOoe';

export const neItems = {
  name: 'enableLink',
  type: 'switch',
  useVisible() {
    return useField().readPretty;
  },
  useComponentProps() {
    var i;
    const { t: e } = useTranslation();
    const field = useField();
    const { fieldSchema: newFieldSchema } = useHooksOoe();
    const oldFieldSchema = useFieldSchema();
    const fieldSchema = newFieldSchema || oldFieldSchema;
    const { dn: c } = useDesignable();
    return {
      title: e('Enable link'),
      checked: ((i = fieldSchema['x-component-props']) == null ? void 0 : i.enableLink) !== false,
      onChange(x) {
        // fieldSchema['x-component-props'] = T(
        //   y({}, fieldSchema == null ? void 0 : fieldSchema['x-component-props']),
        //   {
        //   enableLink: x,
        // });
        fieldSchema['x-component-props'] = {
          ...fieldSchema?.['x-component-props'],
          enableLink: x,
        };
        field.componentProps.enableLink = x;
        c.emit('patch', {
          schema: {
            'x-uid': fieldSchema['x-uid'],
            // 'x-component-props': y({}, fieldSchema == null ? void 0 : fieldSchema['x-component-props']),
            'x-component-props': {
              ...fieldSchema?.['x-component-props'],
            },
          },
        });
        c.refresh();
      },
    };
  },
};
