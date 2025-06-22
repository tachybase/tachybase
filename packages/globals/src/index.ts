class TachybaseGlobal {
  // 私有静态实例
  private static instance: TachybaseGlobal;

  // 私有数据存储 Map
  private dataMap: Map<string, any>;

  // 私有构造函数，防止外部 new
  private constructor() {
    this.dataMap = new Map();
  }

  // 获取单例实例
  public static getInstance(): TachybaseGlobal {
    if (!TachybaseGlobal.instance) {
      TachybaseGlobal.instance = new TachybaseGlobal();
    }
    return TachybaseGlobal.instance;
  }

  // 设置数据
  public set(key: string, value: any): void {
    this.dataMap.set(key, value);
  }

  // 获取数据，找不到返回 undefined
  public get<T = any>(key: string): T | undefined {
    return this.dataMap.get(key);
  }

  // 判断是否存在某个 key
  public has(key: string): boolean {
    return this.dataMap.has(key);
  }

  // 删除某个 key
  public delete(key: string): boolean {
    return this.dataMap.delete(key);
  }

  // 清空所有数据
  public clear(): void {
    this.dataMap.clear();
  }
}

export default TachybaseGlobal;
