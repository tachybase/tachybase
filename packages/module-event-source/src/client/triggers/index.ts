import { ISchema } from '@tachybase/schema';

export abstract class EventSourceTrigger {
  title: string; // 触发方式名称
  type: string; // 触发方式类型, 英文标识
  icon: string;
  color: string; // 显示的背景色
  description?: string; // 简介文案
  options: { [key: string]: ISchema };
  view?: ISchema;
  scope?: { [key: string]: any };
  components?: { [key: string]: any };
  Component?(props): JSX.Element;
}
