import { useCollectionField, useTitleFieldOptions, useDesignable } from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';
import { useTranslation } from '../../../locale';
import { useHooksOoe } from '../hooks/useHooksOoe';
import { y } from '../others/y';
import { T } from '../others/T';

export const teItems = {
  name: 'titleField',
  type: 'select',
  useComponentProps() {
    var b, h, F, C;
    const { t: e } = useTranslation(),
      t = useField(),
      { dn: o } = useDesignable(),
      a = useTitleFieldOptions(),
      { uiSchema: r, fieldSchema: c, collectionField: i } = useHooksOoe(),
      x = useFieldSchema(),
      m = c || x,
      g = useCollectionField(),
      d = i || g,
      A = y(
        y(
          y(
            {},
            (h = (b = d == null ? void 0 : d.uiSchema) == null ? void 0 : b['x-component-props']) == null
              ? void 0
              : h.fieldNames,
          ),
          (F = t == null ? void 0 : t.componentProps) == null ? void 0 : F.fieldNames,
        ),
        (C = m == null ? void 0 : m['x-component-props']) == null ? void 0 : C.fieldNames,
      );
    return {
      title: e('Title field'),
      options: a,
      value: A == null ? void 0 : A.label,
      onChange(v) {
        var S, O, $, W, H, J;
        const l = { 'x-uid': m['x-uid'] },
          u = T(
            y(
              y(
                {},
                (O = (S = d == null ? void 0 : d.uiSchema) == null ? void 0 : S['x-component-props']) == null
                  ? void 0
                  : O.fieldNames,
              ),
              ($ = m['x-component-props']) == null ? void 0 : $.fieldNames,
            ),
            { label: v },
          );
        (m['x-component-props'] = m['x-component-props'] || {}),
          (m['x-component-props'].fieldNames = u),
          (l['x-component-props'] = m['x-component-props']),
          (t.componentProps.fieldNames = (W = m['x-component-props']) == null ? void 0 : W.fieldNames);
        const f = (J = t.path) == null ? void 0 : J.splice(((H = t.path) == null ? void 0 : H.length) - 1, 1);
        t.form.query(`${f.concat('*.' + m.name)}`).forEach((M) => {
          M.componentProps.fieldNames = A;
        }),
          o.emit('patch', { schema: l }),
          o.refresh();
      },
    };
  },
};
