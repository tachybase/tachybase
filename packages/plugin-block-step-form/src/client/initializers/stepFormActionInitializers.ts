import { SchemaInitializer, useCollection } from '@tachybase/client';

import { tval } from '../locale';

export const stepFormActionInitilizers = new SchemaInitializer({
  name: 'stepsForm:configureActions',
  title: tval('Configure actions', { ns: 'core' }),
  icon: 'SettingOutlined',
  items: [
    {
      type: 'item',
      title: tval('Previous'),
      name: 'previousAction',
      Component: 'CreateActionInitializer',
      schema: {
        'x-align': 'right',
        'x-decorator': 'ACLActionProvider',
        'x-acl-action-props': {
          skipScopeCheck: true,
        },
      },
      useVisible() {
        const collection = useCollection();
        return !['view', 'file', 'sql'].includes(collection.template) || collection?.writableView;
      },
    },
    {
      type: 'item',
      title: tval('Next'),
      name: 'nextAction',
      Component: 'CreateActionInitializer',
      schema: {
        'x-align': 'right',
        'x-decorator': 'ACLActionProvider',
        'x-acl-action-props': {
          skipScopeCheck: true,
        },
      },
      useVisible() {
        const collection = useCollection();
        return !['view', 'file', 'sql'].includes(collection.template) || collection?.writableView;
      },
    },
    {
      type: 'item',
      title: tval('Done'),
      name: 'doneAction',
      Component: 'CreateActionInitializer',
      schema: {
        'x-align': 'right',
        'x-decorator': 'ACLActionProvider',
        'x-acl-action-props': {
          skipScopeCheck: true,
        },
      },
      useVisible() {
        const collection = useCollection();
        return !['view', 'file', 'sql'].includes(collection.template) || collection?.writableView;
      },
    },
    {
      type: 'item',
      title: tval('Request action'),
      name: 'requestAction',
      Component: 'CreateActionInitializer',
      schema: {
        'x-align': 'right',
        'x-decorator': 'ACLActionProvider',
        'x-acl-action-props': {
          skipScopeCheck: true,
        },
      },
      useVisible() {
        const collection = useCollection();
        return !['view', 'file', 'sql'].includes(collection.template) || collection?.writableView;
      },
    },
  ],
});
