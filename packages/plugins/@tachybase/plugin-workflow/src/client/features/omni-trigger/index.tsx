import { Plugin } from '@tachybase/client';

import { tval } from '../../locale';
import { PluginWorkflow } from '../../Plugin';
import { OmniActionTrigger } from './OmniActionTrigger';
import { useFormWorkflowCustomActionProps } from './useFormWorkflowCustomActionProps';
import { useRecordWorkflowCustomTriggerActionProps } from './useRecordWorkflowCustomTriggerActionProps';

const triggerWorkflowItem = {
  name: 'triggerWorkflow',
  title: tval('Trigger workflow'),
  Component: 'CustomizeActionInitializer',
  schema: {
    title: tval('Trigger workflow'),
    'x-component': 'Action',
    'x-use-component-props': 'useFormWorkflowCustomActionProps',
    'x-designer': 'Action.Designer',
    'x-action-settings': {
      skipValidator: false,
      onSuccess: { manualClose: true, redirecting: false, successMessage: tval('Submitted successfully') },
      triggerWorkflows: [],
    },
    'x-action': 'customize:triggerWorkflows',
  },
};
const triggerWorkflowAction = {
  name: 'triggerWorkflow',
  title: tval('Trigger workflow'),
  Component: 'CustomizeActionInitializer',
  schema: {
    title: tval('Trigger workflow'),
    'x-component': 'Action',
    'x-use-component-props': 'useRecordWorkflowCustomTriggerActionProps',
    'x-designer': 'Action.Designer',
    'x-action-settings': {
      onSuccess: {
        manualClose: true,
        redirecting: false,
        successMessage: tval('Submitted successfully'),
      },
      triggerWorkflows: [],
    },
    'x-action': 'customize:triggerWorkflows',
  },
};
const triggerWorkflowLinkItem = {
  ...triggerWorkflowAction,
  schema: { ...triggerWorkflowAction.schema, 'x-component': 'Action.Link' },
};
export class PluginOmniTrigger extends Plugin {
  async load() {
    this.app.pm.get<PluginWorkflow>('workflow').registerTrigger('omni-action', OmniActionTrigger);
    this.app.addScopes({
      useFormWorkflowCustomActionProps,
      useRecordWorkflowCustomTriggerActionProps,
    });
    this.app.schemaInitializerManager
      .get('FormActionInitializers')
      .add('customize.triggerWorkflow', triggerWorkflowItem);
    this.app.schemaInitializerManager
      .get('createForm:configureActions')
      .add('customize.triggerWorkflow', triggerWorkflowItem);
    this.app.schemaInitializerManager
      .get('editForm:configureActions')
      .add('customize.triggerWorkflow', triggerWorkflowItem);
    this.app.schemaInitializerManager
      .get('detailsWithPaging:configureActions')
      .add('customize.triggerWorkflow', triggerWorkflowAction);
    this.app.schemaInitializerManager
      .get('details:configureActions')
      .add('customize.triggerWorkflow', triggerWorkflowAction);
    this.app.schemaInitializerManager
      .get('table:configureItemActions')
      .add('customize.triggerWorkflow', triggerWorkflowLinkItem);
    this.app.schemaInitializerManager
      .get('gridCard:configureItemActions')
      .add('customize.triggerWorkflow', triggerWorkflowLinkItem);
    this.app.schemaInitializerManager
      .get('list:configureItemActions')
      .add('customize.triggerWorkflow', triggerWorkflowLinkItem);
  }
}
