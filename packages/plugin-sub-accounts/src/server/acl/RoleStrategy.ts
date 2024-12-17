import { AvailableStrategyOptions } from '@tachybase/acl';

export type RoleStrategyOptions = string | AvailableStrategyOptions;

export type RoleStrategyItem = {
  action: string;
  scope: 'all' | 'own';
};

export class RoleStrategy {
  private strategyList: RoleStrategyItem[] = [];
  private constructor(list: string[]) {
    for (const str of list) {
      this.strategyList.push(RoleStrategy.stringToItem(str));
    }
  }

  public static merge(list: RoleStrategyOptions[]) {
    // TODO: 此处前后变化较大，需要仔细看看前后发生了什么变化
    let actions: RoleStrategy = null;
    for (const listItem of list) {
      if (typeof listItem === 'string') {
        // TODO: 未知策略
        continue;
      }
      if (!listItem.actions) {
        continue;
      }
      // TODO: 上个版本遗留的
      if (listItem.actions === '*') {
        return {
          actions: '*',
        };
      }
      const strategy = new RoleStrategy(listItem.actions as string[]);
      if (!actions) {
        actions = strategy;
        continue;
      }
      actions.mergeAnother(strategy);
    }

    return {
      actions: actions ? actions.getRawString() : null,
    };
  }

  private static stringToItem(str: string): RoleStrategyItem {
    const [action, scope] = str.split(':');
    return {
      action,
      scope: scope === 'own' ? 'own' : 'all',
    };
  }

  private getRawString() {
    return this.strategyList.map(RoleStrategy.itemToString);
  }

  private static itemToString(item: RoleStrategyItem): string {
    return `${item.action}${item.scope === 'own' ? ':own' : ''}`;
  }

  private mergeAnother(another: RoleStrategy) {
    for (const item of another.strategyList) {
      const index = this.strategyList.findIndex((i) => i.action === item.action);
      if (index === -1) {
        this.strategyList.push(item);
        continue;
      }
      if (this.strategyList[index].scope === 'all') {
        this.strategyList[index].scope = item.scope;
      }
    }
  }
}
