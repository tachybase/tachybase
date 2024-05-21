import {
  useBlockRequestContext,
  useCollectionParentRecordData,
  useCollectionFields,
  RecordProvider,
} from '@tachybase/client';
import react from 'react';
import jsxRuntime from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { useTranslation } from './locale';
import { RecursionField, observer, useField } from '@tachybase/schema';
import { Button, Card, Tooltip } from 'antd';
import { styles } from './styles';

export const CommentItem = observer((e) => {
  let P, v, I, S, g;
  const { editing: o, setEditing: s } = e;
  const n = useField();
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
                      children: dayjs((S = n == null ? void 0 : n.value) == null ? void 0 : S.createdAt).fromNow(),
                    }),
                  }),
                ],
              }),
              jsxRuntime.jsx('div', { className: `${l}-item-title-right`, children: e.children }),
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
              o &&
                jsxRuntime.jsxs('div', {
                  className: `${l}-item-editor-button-area`,
                  children: [
                    jsxRuntime.jsx(Button, {
                      onClick: () => {
                        n.form.setFieldState(`${n.address}.content`, (u) => {
                          u.pattern = 'readPretty';
                        }),
                          s(false);
                      },
                      children: m('Cancel'),
                    }),
                    jsxRuntime.jsx(Button, {
                      type: 'primary',
                      onClick: () => {
                        s(false),
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
