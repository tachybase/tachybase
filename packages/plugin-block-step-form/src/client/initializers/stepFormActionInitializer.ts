import { SchemaInitializer, useCollection } from '@tachybase/client';

import { tval } from '../locale';

export const stepFormActionInitializer = new SchemaInitializer({
  name: 'stepsForm:configureActions',
  title: tval('Configure actions', { ns: 'core' }),
  icon: 'SettingOutlined',
  items: [
    {
      type: 'item',
      title: tval('Previous'),
      name: 'previousAction',
      // TODO:
      Component: 'CreateActionInitializer',
      schema: {
        type: 'void',
        title: tval('Previous'),
        'x-component': 'Action',
        'x-use-component-props': 'useStepsFormPreviousActionProps',
        'x-settings': 'actionSettings:stepsFormPrevious',
        'x-toolbar': 'ActionSchemaToolbar',
        'x-action': 'stepsform:previous',
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
        type: 'void',
        title: tval('Next'),
        'x-component': 'Action',
        'x-use-component-props': 'useStepsFormNextActionProps',
        'x-toolbar': 'ActionSchemaToolbar',
        'x-settings': 'actionSettings:stepsFormNext',
        'x-action': 'stepsform:next',
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
      Component: 'CustomizeAddRecordActionInitializer',
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
      Component: 'CustomizeAddRecordActionInitializer',
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
