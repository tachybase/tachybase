export interface PluginItemsOptions {
  name?: string;
  // 通过 sort 字段控制排序位置, 数值越小越靠前
  sort?: number;
  useLoadMethod?: (any) => methodOptionsType;
}

export interface methodOptionsType {
  title: any;
  actionProps: any;
  icon?: React.ReactNode;
  children?: any;
}

export class PluginContextMenu {
  protected menuItems: Record<string, PluginItemsOptions> = {};

  constructor(_pluginMenuItems: Record<string, PluginItemsOptions>) {
    Object.entries(_pluginMenuItems || {}).forEach(([name, PluginItemsOptions]) => {
      this.add(name, PluginItemsOptions);
    });
  }

  get() {
    return this.menuItems;
  }

  add(name: string, options: PluginItemsOptions) {
    this.menuItems[name] = {
      name: name,
      ...options,
    };
  }
}
