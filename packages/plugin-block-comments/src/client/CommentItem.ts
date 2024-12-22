import react from 'react';
import {
  RecordProvider,
  useBlockRequestContext,
  useCollectionFields,
  useCollectionParentRecordData,
} from '@tachybase/client';
import { Field, observer, RecursionField, useField } from '@tachybase/schema';

import { Button, Card, Tooltip } from 'antd';
import dayjs from 'dayjs';
import jsxRuntime from 'react/jsx-runtime';

import { useTranslation } from './locale';
import { styles } from './styles';

export const CommentItem = observer(({ editing, setEditing, children }: any) => {
  let P, v, I, S, g;
  const n = useField<Field>();
  const { t: m } = useTranslation();
  const { componentCls: l } = styles();
  const h = useCollectionParentRecordData();
  const { resource: resource, service: d } = useBlockRequestContext();
  const f = react.useCallback(
    () => async () => {
      await resource.update({
        filterByTk: n.value?.id,
        values: { content: n?.value?.content },
      });
      d.refresh();
    },
    [resource, d, n.value],
  );
  const p = useCollectionFields();
  const L = react.useMemo(() => {
    let u, x;
    return (x = (u = p.find((j) => j.name === 'content')) == null ? void 0 : u.uiSchema) == null
      ? void 0
      : x['x-component-props'];
  }, [p]);
  return jsxRuntime.jsx(RecordProvider, {
    record: n.value,
    parent: h,
    children: jsxRuntime.jsxs('div', {
      className: `${l}-item-container`,
      children: [
        jsxRuntime.jsx('div', { className: `${l}-item-container-line` }),
        jsxRuntime.jsx(Card, {
          size: 'small',
          title: jsxRuntime.jsxs('div', {
            className: `${l}-item-title`,
            children: [
              jsxRuntime.jsxs('div', {
                className: `${l}-item-title-left`,
                children: [
                  jsxRuntime.jsx('span', {
                    children:
                      (v = (P = n == null ? void 0 : n.value) == null ? void 0 : P.createdBy) == null
                        ? void 0
                        : v.nickname,
                  }),
                  jsxRuntime.jsx('span', { children: m('commented') }),
                  jsxRuntime.jsx(Tooltip, {
                    title: dayjs((I = n == null ? void 0 : n.value) == null ? void 0 : I.createdAt).format(
                      'YYYY-MM-DD HH:mm:ss',
                    ),
                    children: jsxRuntime.jsx('span', {
                      children: dayjs(n?.value?.createdAt).fromNow(),
                    }),
                  }),
                ],
              }),
              jsxRuntime.jsx('div', { className: `${l}-item-title-right`, children: children }),
            ],
          }),
          children: jsxRuntime.jsxs('div', {
            className: `${l}-item-editor`,
            children: [
              jsxRuntime.jsx(RecursionField, {
                basePath: n.address,
                name: 'content',
                schema: {
                  type: 'string',
                  name: 'content',
                  'x-component': 'MarkdownVditor',
                  'x-component-props': { ...L, value: n?.value?.content },
                  'x-read-pretty': true,
                },
              }),
              editing &&
                jsxRuntime.jsxs('div', {
                  className: `${l}-item-editor-button-area`,
                  children: [
                    jsxRuntime.jsx(Button, {
                      onClick: () => {
                        n.form.setFieldState(`${n.address}.content`, (u) => {
                          u.pattern = 'readPretty';
                        }),
                          setEditing(false);
                      },
                      children: m('Cancel'),
                    }),
                    jsxRuntime.jsx(Button, {
                      type: 'primary',
                      onClick: () => {
                        setEditing(false),
                          f(),
                          n.form.setFieldState(`${n.address}.content`, (u) => {
                            u.pattern = 'readPretty';
                          });
                      },
                      children: m('Update Comment'),
                    }),
                  ],
                }),
            ],
          }),
        }),
      ],
    }),
  });
});
