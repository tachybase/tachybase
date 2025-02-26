import React from 'react';
import { ActionInitializer } from '@tachybase/client';

export function UpdateCommentActionInitializer(props) {
  const schema = {
    type: 'void',
    title: '{{t("Edit")}}',
    'x-component': 'UpdateCommentActionButton',
  };
  return <ActionInitializer {...props} schema={schema} />;
}
