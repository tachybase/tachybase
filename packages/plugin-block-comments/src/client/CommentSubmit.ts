import { useCallback, useMemo } from 'react';
import {
  useACLActionParamsContext,
  useBlockRequestContext,
  useCollectionFields,
  useDesignable,
} from '@tachybase/client';
import { Field, RecursionField, useField } from '@tachybase/schema';

import { Button } from 'antd';
import jsxRuntime from 'react/jsx-runtime';

import { useTranslation } from './locale';
import { styles } from './styles';
import { useComment } from './useComment';

export function CommentSubmit() {
  const field = useField<Field>();
  const updateUI = useCallback(
    (content) => {
      field.setValue({ ...field.value, content });
    },
    [field],
  );
  const { t } = useTranslation();
  const { wrapSSR, componentCls, hashId } = styles();
  const h = useMemo(() => {
    return field.value?.content?.trim().length > 0;
  }, [field.value]);
  const { resource, service } = useBlockRequestContext();
  const onClick = useCallback(async () => {
    await resource.create({ values: field.value });
    updateUI('');
    service.refresh();
  }, [resource, field, service, updateUI]);
  const { createAble } = useComment();
  const acl = useACLActionParamsContext();
  const { designable } = useDesignable();
  const isHidden = !designable && (field?.data?.hidden || !acl);
  const fields = useCollectionFields();
  const props = useMemo(() => {
    return fields.find((field) => field.name === 'content')?.uiSchema?.['x-component-props'];
  }, [fields]);
  return !createAble || isHidden
    ? null
    : wrapSSR(
        jsxRuntime.jsxs('div', {
          style: { marginTop: 10 },
          className: `${componentCls} ${hashId}`,
          children: [
            jsxRuntime.jsx(RecursionField, {
              basePath: field.address,
              name: 'content',
              schema: {
                type: 'string',
                'x-component': 'MarkdownVditor',
                'x-component-props': {
                  ...props,
                  onChange: (u) => {
                    updateUI(u);
                  },
                },
                'x-read-pretty': false,
                'x-read-only': false,
                name: 'content',
              },
            }),
            jsxRuntime.jsx(Button, {
              disabled: !h,
              onClick,
              type: 'primary',
              style: { marginTop: 10 },
              children: t('Comment'),
            }),
          ],
        }),
      );
}
