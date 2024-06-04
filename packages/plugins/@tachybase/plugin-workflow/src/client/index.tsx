import React from 'react';
import { Plugin } from '@tachybase/client';
import { Registry } from '@tachybase/utils/client';

import { ExecutionPage } from './ExecutionPage';
import { PluginActionTrigger } from './features/action-trigger';
import { PluginAggregate } from './features/aggregate';
import { PluginAPIRegularClient } from './features/api-regular';
import { PluginDelay } from './features/delay';
import { PluginDaynamicCalculation } from './features/dynamic-calculation';
import PluginWorkflowJSParseClient from './features/js-parse';
import PluginWorkflowJsonParseClient from './features/json-parse';
import { PluginLoop } from './features/loop';
import { PluginManual } from './features/manual';
import { PluginParallel } from './features/parallel';
import { PluginRequest } from './features/request';
import { PluginSql } from './features/sql';
import { NAMESPACE } from './locale';
import { Instruction } from './nodes';
import CalculationInstruction from './nodes/calculation';
import ConditionInstruction from './nodes/condition';
import CreateInstruction from './nodes/create';
import DestroyInstruction from './nodes/destroy';
import EndInstruction from './nodes/end';
import QueryInstruction from './nodes/query';
import UpdateInstruction from './nodes/update';
import { customizeSubmitToWorkflowActionSettings } from './settings/customizeSubmitToWorkflowActionSettings';
import { Trigger } from './triggers';
import CollectionTrigger from './triggers/collection';
import ScheduleTrigger from './triggers/schedule';
import { getWorkflowDetailPath, getWorkflowExecutionsPath } from './utils';
import { WorkflowPage } from './WorkflowPage';
import { WorkflowPane } from './WorkflowPane';

export default class PluginWorkflowClient extends Plugin {
  triggers = new Registry<Trigger>();
  instructions = new Registry<Instruction>();
  getTriggersOptions = () => {
    return Array.from(this.triggers.getEntities()).map(([value, { title, ...options }]) => ({
      value,
      label: title,
      color: 'gold',
      options,
    }));
  };

  isWorkflowSync(workflow) {
    return this.triggers.get(workflow.type).sync ?? workflow.sync;
  }

  registerTrigger(type: string, trigger: Trigger | { new (): Trigger }) {
    if (typeof trigger === 'function') {
      this.triggers.register(type, new trigger());
    } else if (trigger) {
      this.triggers.register(type, trigger);
    } else {
      throw new TypeError('invalid trigger type to register');
    }
  }

  registerInstruction(type: string, instruction: Instruction | { new (): Instruction }) {
    if (typeof instruction === 'function') {
      this.instructions.register(type, new instruction());
    } else if (instruction instanceof Instruction) {
      this.instructions.register(type, instruction);
    } else {
      throw new TypeError('invalid instruction type to register');
    }
  }

  async afterAdd() {
    await this.pm.add(PluginSql);
    await this.pm.add(PluginRequest);
    await this.pm.add(PluginParallel);
    await this.pm.add(PluginManual);
    await this.pm.add(PluginLoop);
    await this.pm.add(PluginDaynamicCalculation);
    await this.pm.add(PluginDelay);
    await this.pm.add(PluginAggregate);
    await this.pm.add(PluginActionTrigger);
    await this.pm.add(PluginWorkflowJsonParseClient);
    await this.pm.add(PluginWorkflowJSParseClient);
    await this.pm.add(PluginAPIRegularClient);
  }

  async load() {
    this.addRoutes();
    this.addComponents();

    this.app.pluginSettingsManager.add(NAMESPACE, {
      icon: 'PartitionOutlined',
      title: `{{t("Workflow", { ns: "${NAMESPACE}" })}}`,
      Component: WorkflowPane,
      aclSnippet: 'pm.workflow.workflows',
    });

    this.app.schemaSettingsManager.add(customizeSubmitToWorkflowActionSettings);

    this.registerTrigger('collection', CollectionTrigger);
    this.registerTrigger('schedule', ScheduleTrigger);

    this.registerInstruction('calculation', CalculationInstruction);
    this.registerInstruction('condition', ConditionInstruction);
    this.registerInstruction('end', EndInstruction);

    this.registerInstruction('query', QueryInstruction);
    this.registerInstruction('create', CreateInstruction);
    this.registerInstruction('update', UpdateInstruction);
    this.registerInstruction('destroy', DestroyInstruction);
  }

  addComponents() {
    this.app.addComponents({
      WorkflowPage,
      ExecutionPage,
    });
  }

  addRoutes() {
    this.app.router.add('admin.workflow.workflows.id', {
      path: getWorkflowDetailPath(':id'),
      element: <WorkflowPage />,
    });
    this.app.router.add('admin.workflow.executions.id', {
      path: getWorkflowExecutionsPath(':id'),
      element: <ExecutionPage />,
    });
  }
}

export * from './Branch';
export * from './FlowContext';
export * from './constants';
export * from './nodes';
export { Trigger, useTrigger } from './triggers';
export * from './variable';
export * from './components';
export * from './utils';
export * from './hooks';
export { default as useStyles } from './style';
export * from './variable';
export * from './ExecutionContextProvider';
