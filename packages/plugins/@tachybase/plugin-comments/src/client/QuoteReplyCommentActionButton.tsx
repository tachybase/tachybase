import React from 'react';
import { useDesignable, useACLActionParamsContext } from '@tachybase/client';
import { useCallback } from 'react';
import { useTranslation } from './locale';
import { useField } from '@tachybase/schema';

export function QuoteReplyCommentActionButton() {
  const field = useField();
  const { t } = useTranslation();
  const acl = useACLActionParamsContext();
  const { designable } = useDesignable();
  const onClick = useCallback(() => {
    const submitContentPath = field.address.slice(0, field.address.length - 4).concat('submit.content');
    const contentPath = field.address.slice(0, field.address.length - 2).concat('content');
    const content = field.form.getValuesIn(contentPath) ?? '';
    field.form.setValuesIn(
      submitContentPath,
      `${content
        .split(
          `
`,
        )
        .map((p) => `> ${p}`).join(`
`)}`,
    );
  }, [field.address, field.form]);
  return !designable && (field?.data?.hidden || !acl) ? null : (
    <a style={{ fontSize: 14 }} onClick={onClick}>
      {t('Quote Reply')}
    </a>
  );
}
