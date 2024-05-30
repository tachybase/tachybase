import { useEffect, useRef, useState } from 'react';
import {
  ActionContextProvider,
  ResourceActionProvider,
  SchemaComponent,
  useActionContext,
  useRecord,
} from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { Select } from 'antd';
import { jsx, jsxs } from 'react/jsx-runtime';

import { schemaFfe } from '../schema/schemaFfe';

export const DepartmentOwnersField = () => {
  const [e, t] = useState(false),
    o = useRecord(),
    a = useField(),
    [r, c] = useState([]),
    i = useRef([]),
    x = (d, A) => {
      i.current = A;
    },
    m = () => {
      const { setVisible: d } = useActionContext();
      return {
        run() {
          const A = a.value || [];
          a.setValue([...A, ...i.current]), (i.current = []), d(false);
        },
      };
    };
  useEffect(() => {
    a.value && c(a.value.map((d) => ({ value: d.id, label: d.nickname || d.username })));
  }, [a.value]);
  const g = (d) => {
    var A;
    return jsx(ResourceActionProvider, {
      collection: 'users',
      request: {
        resource: `departments/${o.id}/members`,
        action: 'list',
        params: { filter: (A = a.value) != null && A.length ? { id: { $notIn: a.value.map((b) => b.id) } } : {} },
      },
      children: d.children,
    });
  };
  return jsxs(ActionContextProvider, {
    value: { visible: e, setVisible: t },
    children: [
      jsx(Select, {
        open: false,
        onChange: (d) => {
          if (!d) {
            a.setValue([]);
            return;
          }
          a.setValue(d.map(({ label: A, value: b }) => ({ id: b, nickname: A })));
        },
        mode: 'multiple',
        value: r,
        labelInValue: true,
        onDropdownVisibleChange: (d) => t(d),
      }),
      jsx(SchemaComponent, {
        schema: schemaFfe,
        components: { RequestProvider: g },
        scope: { department: o, handleSelect: x, useSelectOwners: m },
      }),
    ],
  });
};
