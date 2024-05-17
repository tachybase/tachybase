import { createContext, useContext } from 'react';

interface ConfigSettingContextType {
  // laydirection, 定义区块下, 表单字段的显示方向, 横向排列还是纵向排列, 默认纵向
  layoutDirection?: 'row' | 'column';
}

// NOTE: 专门用于向下传递 Grid Block 的配置信息
// 用于写 Laydirection 全区块配置, 发现传递路径要四五层左右, 转而用 context 方法
const ContextConfigSetting = createContext<ConfigSettingContextType>({
  layoutDirection: 'column',
});

export const ConfigSettingProvider = ContextConfigSetting.Provider;
export const ConfigSettingConsumer = ContextConfigSetting.Consumer;

export function useContextConfigSetting() {
  return useContext(ContextConfigSetting);
}
