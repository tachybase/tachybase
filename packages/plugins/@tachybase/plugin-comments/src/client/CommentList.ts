import { useCallback, useState } from 'react';
import { useBlockRequestContext, withDynamicSchemaProps } from '@tachybase/client';
import { RecursionField, Schema, useField, useFieldSchema, useForm } from '@tachybase/schema';

import { List, Spin } from 'antd';
import jsxRuntime from 'react/jsx-runtime';

import { styles } from './styles';

export const CommentList = withDynamicSchemaProps((props) => {
  const o = useFieldSchema();
  const s = useField();
  const [n] = useState(new Map());
  const { wrapSSR, hashId, componentCls } = styles();
  useForm();
  const { service } = useBlockRequestContext();
  const { run, params } = service;
  const p = service?.data?.meta;
  const L = useCallback(
    (S) => (n.has(S) || n.set(S, new Schema({ type: 'object', properties: { [S]: o.properties.item } })), n.get(S)),
    [o.properties, n],
  );
  const P = useCallback(
    (S, g) => {
      run({ ...params?.[0], page: S, pageSize: g });
    },
    [run, params],
  );
  return service != null && service.loading
    ? jsxRuntime.jsx('div', {
        style: { display: 'flex', justifyContent: 'center' },
        children: jsxRuntime.jsx(Spin, { spinning: true }),
      })
    : wrapSSR(
        jsxRuntime.jsx('div', {
          className: `${componentCls} ${hashId}`,
          children: jsxRuntime.jsx(List, {
            ...props,
            pagination:
              !p || p.count <= p.pageSize
                ? false
                : {
                    onChange: P,
                    total: p?.count || 0,
                    pageSize: p?.pageSize || 10,
                    current: p?.page || 1,
                  },
            children: jsxRuntime.jsx('div', {
              style: { display: 'flex', flexDirection: 'column' },
              children: s.value?.length
                ? s.value.map((S, g) => {
                    const u = g === 0,
                      x = g === s.value.length - 1;
                    return jsxRuntime.jsx(
                      'div',
                      {
                        style: { position: 'relative', padding: `${u ? 0 : '10px'} 0 ${x ? 0 : '10px'} 0` },
                        children: jsxRuntime.jsx(RecursionField, {
                          basePath: s.address,
                          name: g,
                          onlyRenderProperties: true,
                          schema: L(g),
                        }),
                      },
                      g,
                    );
                  })
                : null,
            }),
          }),
        }),
      );
});
