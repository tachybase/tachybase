import { SchemaInitializerItemType } from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

import { PluginWorkflow } from '../../Plugin';
import { UseVariableOptions, VariableOption } from '../../variable';

export type NodeAvailableContext = {
  engine: PluginWorkflow;
  workflow: object;
  upstream: object;
  branchIndex: number;
};

export const enum BuiltinGroupType {
  CONTROL = 'control',
  COLLECTION = 'collection',
  EXTENDED = 'extended',
  MANUAL = 'manual',
  ADVANCED = 'advanced',
}

export type GroupType = BuiltinGroupType | string;

export abstract class Instruction {
  title: string;
  type: string;
  group: GroupType;
  description?: string;
  options?: { label: string; value: any; key: string }[];
  fieldset: { [key: string]: ISchema };
  view?: ISchema;
  scope?: { [key: string]: any };
  components?: { [key: string]: any };
  Component?(props): JSX.Element;
  useVariables?(node, options?: UseVariableOptions): VariableOption;
  useScopeVariables?(node, options?): VariableOption[];
  useInitializers?(node): SchemaInitializerItemType | null;
  isAvailable?(ctx: NodeAvailableContext): boolean;
  end?: boolean | ((node) => boolean);
}
