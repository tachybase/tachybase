import { Plugin } from '@tachybase/client';

import WorkflowPlugin from '../..';
import { NAMESPACE } from '../../locale';
import Manual from './instruction';
import { addCustomFormField, addCustomFormField_deprecated } from './instruction/forms/custom';
import {
  addActionButton,
  addActionButton_deprecated,
  addBlockButton,
  addBlockButton_deprecated,
} from './instruction/SchemaConfig';
import { WorkflowTodo } from './WorkflowTodo';
import { WorkflowTodoBlockInitializer } from './WorkflowTodoBlockInitializer';

export class PluginManual extends Plugin {
  async load() {
    this.addComponents();

    const workflow = this.app.pm.get('workflow') as WorkflowPlugin;
    workflow.registerInstruction('manual', Manual);

    this.app.schemaInitializerManager.add(addBlockButton_deprecated);
    this.app.schemaInitializerManager.add(addBlockButton);
    this.app.schemaInitializerManager.add(addActionButton_deprecated);
    this.app.schemaInitializerManager.add(addActionButton);
    this.app.schemaInitializerManager.add(addCustomFormField_deprecated);
    this.app.schemaInitializerManager.add(addCustomFormField);

    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    blockInitializers.add('otherBlocks.workflowTodos', {
      title: `{{t("Workflow todos", { ns: "${NAMESPACE}" })}}`,
      Component: 'WorkflowTodoBlockInitializer',
      icon: 'CheckSquareOutlined',
    });
  }

  addComponents() {
    this.app.addComponents({
      WorkflowTodo,
      WorkflowTodoBlockInitializer,
    });
  }
}
