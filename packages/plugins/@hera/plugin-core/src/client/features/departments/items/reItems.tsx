import { useFieldModeOptions, useDesignable } from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';
import { useTranslation } from '../../../locale';
import { useHooksOoe } from '../hooks/useHooksOoe';

export const reItems = {
  name: 'fieldComponent',
  type: 'select',
  useComponentProps() {
    const { t: e } = useTranslation(),
      t = useField(),
      { fieldSchema: o, collectionField: a } = useHooksOoe(),
      r = useFieldSchema(),
      c = o || r,
      i = useFieldModeOptions({ fieldSchema: o, collectionField: a }),
      { dn: x } = useDesignable();
    return {
      title: e('Field component'),
      options: i,
      value: 'Select',
      onChange(m) {
        const g = { 'x-uid': c['x-uid'] };
        (c['x-component-props'] = c['x-component-props'] || {}),
          (c['x-component-props'].mode = m),
          (g['x-component-props'] = c['x-component-props']),
          (t.componentProps = t.componentProps || {}),
          (t.componentProps.mode = m),
          x.emit('patch', { schema: g }),
          x.refresh();
      },
    };
  },
};
