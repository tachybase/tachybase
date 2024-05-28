import React from 'react';
import { ActionInitializer } from '@tachybase/client';

import { useTranslation } from './locale';

export function QuoteReplyCommentActionInitializer(props) {
  const { t } = useTranslation();
  const schema = { type: 'void', title: t('Quote Reply'), 'x-component': 'QuoteReplyCommentActionButton' };
  return <ActionInitializer {...props} schema={schema} />;
}
