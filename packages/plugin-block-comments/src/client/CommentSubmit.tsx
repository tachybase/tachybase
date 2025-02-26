import { useCallback, useMemo } from 'react';
import {
  useACLActionParamsContext,
  useBlockRequestContext,
  useCollectionFields,
  useDesignable,
} from '@tachybase/client';
import { Field, RecursionField, useField } from '@tachybase/schema';

import { Button } from 'antd';

import { useTranslation } from './locale';
import { styles } from './styles';
import { useComment } from './useComment';

export function CommentSubmit() {
  const field = useField<Field>();
  const updateUI = useCallback(
    (content) => {
      field.setValue({
        ...field.value,
        content,
      });
    },
    [field],
  );

  const { t } = useTranslation();
  const { wrapSSR, componentCls, hashId } = styles();

  const haveContent = useMemo(() => {
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

  if (!createAble || isHidden) {
    return null;
  }

  return wrapSSR(
    <div style={{ marginTop: 10 }} className={`${componentCls} ${hashId}`}>
      <RecursionField
        basePath={field.address}
        name={'content'}
        schema={{
          name: 'content',
          type: 'string',
          'x-component': 'MarkdownVditor',
          'x-component-props': {
            ...props,
            onChange: (params) => {
              updateUI(params);
            },
          },
          'x-read-pretty': false,
          'x-read-only': false,
        }}
      />
      <Button style={{ marginTop: 10 }} type="primary" disabled={!haveContent} onClick={onClick}>
        {t('Comment')}
      </Button>
    </div>,
  );
}
