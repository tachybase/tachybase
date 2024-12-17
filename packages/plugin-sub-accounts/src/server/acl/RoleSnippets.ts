import minimatch from 'minimatch';

class RoleSnippetItem {
  // 类似 pm pm.mobile-client.interface ui 的写法
  public name: string;

  public allow: boolean = true;

  constructor(str: string) {
    this.allow = !str.startsWith('!');
    if (this.allow) {
      this.name = str;
    } else {
      this.name = str.slice(1);
    }
  }
}

export class RoleSnippets {
  private allowList: RoleSnippetItem[] = [];

  private blockList: RoleSnippetItem[] = [];

  constructor(snippets: string[]) {
    snippets.forEach((snippet) => {
      const roleSnippet = new RoleSnippetItem(snippet);
      if (roleSnippet.allow) {
        this.allowList.push(roleSnippet);
      } else {
        this.blockList.push(roleSnippet);
      }
    });
  }

  public static mergeSet(roleSnippets: Set<string>[]): string[] {
    return RoleSnippets.merge(roleSnippets.map((snippet) => new RoleSnippets([...snippet])));
  }

  private checkAllow(target: string): boolean {
    for (const item of this.blockList) {
      if (minimatch(target, item.name)) {
        return false;
      }
    }
    for (const item of this.allowList) {
      if (minimatch(target, item.name)) {
        return true;
      }
    }
    return false;
  }

  private static merge(roleSnippets: RoleSnippets[]): string[] {
    const invalidBlock = new Set<string>();
    const validBlock = new Set<string>();

    // block中有被其他allow的则认为无效
    roleSnippets.forEach((left) => {
      left.blockList.forEach((blockItem) => {
        const target = blockItem.name;
        if (invalidBlock.has(target) || validBlock.has(target)) {
          return;
        }
        const otherAllow = roleSnippets.some((right) => right !== left && right.checkAllow(target));
        if (!otherAllow) {
          validBlock.add(target);
        } else {
          invalidBlock.add(target);
        }
      });
    });

    const validAllow = new Set<string>();
    for (const roleSnippet of roleSnippets) {
      for (const allowItem of roleSnippet.allowList) {
        validAllow.add(allowItem.name);
      }
    }
    // allow,block中如果有父集则去掉子集
    RoleSnippets.filterSubset(validAllow);
    RoleSnippets.filterSubset(validBlock);

    // 合并
    const list = [];
    for (const item of validAllow) {
      list.push(item);
    }
    for (const item of validBlock) {
      list.push(`!${item}`);
    }
    return list;
  }

  private static filterSubset(set: Set<string>) {
    // 有父集的去掉子集
    for (const left of set) {
      for (const right of set) {
        if (left === right) {
          continue;
        }
        if (minimatch(left, right)) {
          set.delete(left);
          break;
        }
      }
    }
  }
}
