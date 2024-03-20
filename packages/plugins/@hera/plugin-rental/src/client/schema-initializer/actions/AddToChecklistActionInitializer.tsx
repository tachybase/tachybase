import React from 'react';
import { ActionInitializer } from '@nocobase/client';
import { tval } from '../../locale';

export const AddToChecklistActionInitializer = (props) => {
  const schema = {
    title: tval('Add to checklist'),
    'x-action': 'add-to-checklist',
    'x-component': 'Action',
    'x-designer': 'Action.Designer',
    'x-component-props': {
      icon: 'FormOutlined',
      useProps: '{{ useAddToChecklistActionProps }}',
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
