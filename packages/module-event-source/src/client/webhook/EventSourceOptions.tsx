import { usePlugin } from '@tachybase/client';

import ModuleEventSourceClient from '..';

export const EventSourceOptions = ({ type }) => {
  const plugin = usePlugin(ModuleEventSourceClient); // 获取插件
  const trigger = plugin.triggers.get(type); // 根据 type 获取对应的触发器

  if (!trigger) {
    return null;
  }

  return trigger.options; // 获取触发器的选项 schema
};
