import { useCallback } from 'react';
import { useACLActionParamsContext, useDesignable } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { useTranslation } from './locale';

export function QuoteReplyCommentActionButton() {
  const field = useField();
  const { t } = useTranslation();
  const acl = useACLActionParamsContext();
  const { designable } = useDesignable();
  const onClick = useCallback(() => {
    const submitContentPath = field.address.slice(0, field.address.length - 4).concat('submit.content');
    const contentPath = field.address.slice(0, field.address.length - 2).concat('content');
    const content = field.form.getValuesIn(contentPath) ?? '';
    field.form.setValuesIn(submitContentPath, formatContent(content));
  }, [field.address, field.form]);

  if (!designable && (field?.data?.hidden || !acl)) {
    return null;
  }

  return (
    <a style={{ fontSize: 14 }} onClick={onClick}>
      {t('Quote Reply')}
    </a>
  );
}

function formatContent(content) {
  return content
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');
}
