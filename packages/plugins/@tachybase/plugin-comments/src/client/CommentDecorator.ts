import { useCallback, useEffect, useState } from 'react';
import {
  CollectionManagerProvider,
  CollectionProvider,
  List,
  useDesignable,
  withDynamicSchemaProps,
} from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';

import jsxRuntime from 'react/jsx-runtime';

import { CommentContext } from './CommentContext';

export const CommentDecorator = withDynamicSchemaProps((props) => {
  let o;
  return jsxRuntime.jsx(H, {
    ...props,
    children: jsxRuntime.jsx(List.Decorator, {
      ...props,
      children: jsxRuntime.jsx(CollectionManagerProvider, {
        dataSource: props.dataSource,
        children: jsxRuntime.jsx(CollectionProvider, {
          name: `${(o = props.association) != null ? o : props.collection}`,
          children: props.children,
        }),
      }),
    }),
  });
});
export function H(e) {
  useField();
  const o = useFieldSchema();
  const [s, n] = useState(false);
  const { dn: m } = useDesignable();
  useEffect(() => {
    const i = m.current['x-component-props']?.createAble;
    n(i === void 0 ? true : i);
  }, []);
  const l = useCallback(
      (i) => {
        const d = Object.assign({}, o['x-component-props'], i);
        (o['x-component-props'] = d),
          m.emit('patch', { schema: { 'x-uid': o['x-uid'], 'x-component-props': o['x-component-props'] } }),
          m.refresh();
      },
      [m, o],
    ),
    h = useCallback(
      (i) => {
        l({ createAble: i }), n(i);
      },
      [n, l],
    );
  return jsxRuntime.jsx(CommentContext.Provider, { value: { createAble: s, setCreateAble: h }, children: e.children });
}
