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

export enum BuiltinGroupType {
  CONTROL = 'control',
  COLLECTION = 'collection',
  EXTENDED = 'extended',
  MANUAL = 'manual',
  ADVANCED = 'advanced',
}

export type GroupType = BuiltinGroupType | string;

export abstract class Instruction {
  title: string; // 节点名称
  type: string; // 节点的类型, 英文标识
  group: GroupType; // 节点的分组
  icon: string; // 节点的 icon
  color: string; // 节点显示的背景色
  isHot?: boolean; // 是否在热门分类里显示
  description?: string; // 节点配置界面, 简介文案
  options?: { label: string; value: any; key: string }[];
  fieldset: { [key: string]: ISchema };
  view?: ISchema;
  scope?: { [key: string]: any };
  components?: { [key: string]: any };
  Component?(props): JSX.Element;
  useVariables?(node, options?: UseVariableOptions): VariableOption;
  useScopeVariables?(node, options?): VariableOption[];
  useCurrentFormVariables?(node, options?): VariableOption[];
  useInitializers?(node): SchemaInitializerItemType | null;
  isAvailable?(ctx: NodeAvailableContext): boolean;
  end?: boolean | ((node) => boolean);
}
