import { useMemo } from 'react';
import { usePlugin } from '@tachybase/client';

import ModuleEventSourceClient from '..';

export const useEventSourceOptions = (type) => {
  const plugin = usePlugin(ModuleEventSourceClient); // 获取插件

  const options = useMemo(() => {
    const trigger = plugin.triggers.get(type); // 根据 type 获取对应的触发器
    if (!trigger) {
      return [];
    }
    return trigger.options; // 获取触发器的选项 schema
  }, [plugin, type]);

  return options;
};
