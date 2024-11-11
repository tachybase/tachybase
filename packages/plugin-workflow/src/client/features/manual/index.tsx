import React from 'react';
import { Plugin } from '@tachybase/client';

import { PartitionOutlined } from '@ant-design/icons';

import WorkflowPlugin from '../..';
import { NAMESPACE } from '../../locale';
import Manual from './instruction';
import { addCustomFormField } from './instruction/forms/custom';
import { addActionButton, addBlockButton } from './instruction/SchemaConfig';
import { WorkflowTodo } from './WorkflowTodo';
import { WorkflowTodoBlockInitializer } from './WorkflowTodoBlockInitializer';

export class PluginManual extends Plugin {
  async load() {
    this.addComponents();

    const workflow = this.app.pm.get('workflow') as WorkflowPlugin;
    workflow.registerInstruction('manual', Manual);

    this.app.schemaInitializerManager.add(addBlockButton);
    this.app.schemaInitializerManager.add(addActionButton);
    this.app.schemaInitializerManager.add(addCustomFormField);

    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    blockInitializers.add('otherBlocks.workflow', {
      name: 'workflow',
      title: `{{t("Workflow", { ns: "${NAMESPACE}" })}}`,
      type: 'subMenu',
      icon: <PartitionOutlined />,
      children: [
        {
          name: 'common',
          title: `{{t("Common", { ns: "${NAMESPACE}" })}}`,
          type: 'itemGroup',
          children: [
            {
              name: 'todos',
              title: `{{t("Workflow todos", { ns: "${NAMESPACE}" })}}`,
              Component: 'WorkflowTodoBlockInitializer',
              icon: 'CheckSquareOutlined',
            },
          ],
        },
      ],
    });
  }

  addComponents() {
    this.app.addComponents({
      WorkflowTodo,
      WorkflowTodoBlockInitializer,
    });
  }
}
